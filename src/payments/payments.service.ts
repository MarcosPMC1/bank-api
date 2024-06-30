import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Between, DataSource, Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { ReportPaymentDto } from './dto/report-payment.dto';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

interface S3Upload {
  ETag: string;
  ServerSideEncryption: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  private readonly s3 = new S3({
    accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
  });

  create(createPaymentDto: CreatePaymentDto) {
    return this.dataSource.transaction(async (entityManager) => {
      const accountRepository = entityManager.getRepository(Account);
      const paymentRepository = entityManager.getRepository(Payment);

      if (createPaymentDto.receiver == createPaymentDto.sender) {
        throw new BadRequestException('Cannot send value to yourself');
      }

      const receiver = await accountRepository
        .findOneOrFail({ where: { id: createPaymentDto.receiver } })
        .catch(() => {
          throw new NotFoundException('Receiver not found');
        });

      const sender = await accountRepository
        .findOneOrFail({ where: { id: createPaymentDto.sender } })
        .catch(() => {
          throw new NotFoundException('Sender not found');
        });

      if (sender.balance < createPaymentDto.value) {
        throw new BadRequestException('Sender not has balance');
      }

      receiver.balance =
        Number(receiver.balance) + Number(createPaymentDto.value);
      sender.balance -= createPaymentDto.value;

      await accountRepository.save([receiver, sender]);

      return await paymentRepository.save(
        paymentRepository.create({
          description: createPaymentDto.description,
          value: createPaymentDto.value,
          sender,
          receiver,
        }),
      );
    });
  }

  findAll() {
    return this.paymentRepository.find();
  }

  async findOne(id: string) {
    return this.paymentRepository.findOneOrFail({ where: { id } }).catch(() => {
      throw new NotFoundException();
    });
  }

  async findReport({ startDate, endDate }: ReportPaymentDto, id: string) {
    const payments = await this.paymentRepository.find({
      where: { date: Between(startDate, endDate), idsender: id },
    });
    return {
      accountId: id,
      startDate,
      endDate,
      total: await this.paymentRepository.sum('value'),
      payments,
    };
  }

  async upload(fileName: string, file: Buffer, id: string) {
    const payment = await this.paymentRepository
      .findOneOrFail({ where: { id } })
      .catch(() => {
        throw new NotFoundException('not found payment');
      });

    const files3: S3Upload = await new Promise((resolve, reject) =>
      this.s3.upload(
        {
          Bucket: 'bankapistore',
          Key: fileName,
          Body: file,
        },
        (err, data) => {
          if (err) {
            Logger.error(err);
            reject(err.message);
          }
          resolve(data as S3Upload);
        },
      ),
    );

    payment.location = files3.Location;
    payment.etag = files3.ETag;

    return this.paymentRepository.save(payment);
  }
}

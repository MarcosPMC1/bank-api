import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    console.log(createPaymentDto)
    return this.paymentRepository.manager.transaction(async (entityManager) => {
      const accountRepository = entityManager.getRepository(Account)
      const paymentRepository = entityManager.getRepository(Payment)


      const receiver = await accountRepository.findOneOrFail({ where: { id: createPaymentDto.receiver } })
      .catch(() => { throw new NotFoundException('Receiver not found') })

      const sender = await accountRepository.findOneOrFail({ where: { id: createPaymentDto.sender } })
      .catch(() => { throw new NotFoundException('Sender not found') })

      if(sender.balance < createPaymentDto.value){
        throw new BadRequestException('Sender not has balance')
      }

      await accountRepository.update(sender.id, { balance: (Number(sender.balance) - Number(createPaymentDto.value)) })
      await accountRepository.update(receiver.id, { balance: (Number(sender.balance) + Number(createPaymentDto.value)) })

      await paymentRepository.save(paymentRepository.create({ 
        description: createPaymentDto.description,
        value: createPaymentDto.value,
        sender,
        receiver,
       }))
    })
  }

  findAll() {
    return this.paymentRepository.find()
  }

  async findOne(id: string) {
    return this.paymentRepository.findOneOrFail({ where: { id } }).catch(() => { throw new NotFoundException() })
  }

}

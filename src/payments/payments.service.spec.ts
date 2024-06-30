import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { DataSource, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Account } from '../accounts/entities/account.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentsRepository: Repository<Payment>;
  let dataSource: DataSource;

  const userMock: Array<Account> = [
    {
      id: '1',
      name: 'Marcos',
      account_type: 'POUPANCA',
      balance: 10,
      createdAt: undefined,
      updateAt: undefined,
      deleteAt: undefined,
      receiver: new Payment,
      sender: new Payment
    },
    {
      id: '2',
      name: 'Pedro',
      account_type: 'POUPANCA',
      balance: 5,
      receiver: new Payment,
      sender: new Payment,
      createdAt: undefined,
      updateAt: undefined,
      deleteAt: undefined
    }
  ]

  const paymentMock: Payment = {
    id: 'p1',
    description: 'teste',
    value: 5,
    idreceiver: '123',
    idsender: '321',
    date: new Date('2024-06-01'),
    etag: null,
    location: null,
    receiver: userMock['1'],
    sender: userMock['2']
  };

  const PAYMENT_REPOSITORY_TOKEN = getRepositoryToken(Payment);
  const DATASOURCE_TOKEN = getDataSourceToken()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PAYMENT_REPOSITORY_TOKEN,
          useValue: {
            findOneOrFail: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            sum: jest.fn(() => 1)
          },
        },
        {
          provide: DATASOURCE_TOKEN,
          useValue: {
            transaction: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
        PaymentsService,
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentsRepository = module.get<Repository<Payment>>(
      PAYMENT_REPOSITORY_TOKEN,
    );
    dataSource = module.get<DataSource>(DATASOURCE_TOKEN)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('paymentsRepository should be defined', () => {
    expect(paymentsRepository).toBeDefined();
  });

  it('dataSource should be defined', () => {
    expect(dataSource).toBeDefined()
  })

  describe('create', () => {
    it('should success', () => {
      jest.spyOn(dataSource, 'transaction').mockResolvedValue(paymentMock);
      const result = service.create({
        description: paymentMock.description,
        receiver: paymentMock.idreceiver,
        sender: paymentMock.idsender,
        value: paymentMock.value,
      });
      expect(result).resolves.toBe(paymentMock);
    });

    it('cannot send value to yourself', () => {
      jest.spyOn(dataSource, 'transaction').mockRejectedValue(new BadRequestException('Cannot send value to yourself'))
      const result = service.create({
        description: paymentMock.description,
        receiver: paymentMock.idreceiver,
        sender: paymentMock.idreceiver,
        value: paymentMock.value,
      });
      expect(result).rejects.toThrow(new BadRequestException('Cannot send value to yourself'))
    });

    it('receiver not found', () => {
      jest.spyOn(dataSource, 'transaction').mockRejectedValue(new NotFoundException('Receiver not found'))
      const result = service.create({
        description: paymentMock.description,
        receiver: '7',
        sender: paymentMock.idreceiver,
        value: paymentMock.value,
      });
      expect(result).rejects.toThrow(new NotFoundException('Receiver not found'))
    });

    it('sender not found', () => {
      jest.spyOn(dataSource, 'transaction').mockRejectedValue(new NotFoundException('Sender not found'))
      const result = service.create({
        description: paymentMock.description,
        receiver: paymentMock.idreceiver,
        sender: '8',
        value: paymentMock.value,
      });
      expect(result).rejects.toThrow(new NotFoundException('Sender not found'))
    });

    it('sender not has balance', () => {
      jest.spyOn(dataSource, 'transaction').mockRejectedValue(new BadRequestException('Sender not has balance'))
      const result = service.create({
        description: paymentMock.description,
        receiver: paymentMock.idreceiver,
        sender: paymentMock.idsender,
        value: 50000,
      });
      expect(result).rejects.toThrow(new BadRequestException('Sender not has balance'))
    });
  });

  describe('findAll', () => {
    it('should success', () => {
      jest.spyOn(paymentsRepository, 'find').mockResolvedValue([paymentMock])
      const result = service.findAll()
      expect(result).resolves.toEqual([paymentMock])
    })
  })

  describe('findOne', () => {
    it('should success', () => {
      jest.spyOn(paymentsRepository, 'findOneOrFail').mockResolvedValue(paymentMock)
      const result = service.findOne('p1')
      expect(result).resolves.toEqual(paymentMock)
    });

    it('not found exception', () => {
      jest.spyOn(paymentsRepository, 'findOneOrFail').mockRejectedValue(new NotFoundException())
      const result = service.findOne('2')
      expect(result).rejects.toThrow(new NotFoundException())
    });
  })

  describe('findReport', () => {
    it('should success', () => {
      jest.spyOn(paymentsRepository, 'find').mockResolvedValue([paymentMock])
      const startDate = new Date('2024-06-01')
      const endDate = new Date('2024-06-07')
      const result = service.findReport({ startDate, endDate }, 'p1')
      expect(result).resolves.toEqual({
        accountId: 'p1',
        startDate,
        endDate,
        total: 1,
        payments: [paymentMock]
      })
    })
  })
});

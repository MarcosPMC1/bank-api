import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentsRepository: Repository<Payment>;

  const paymentMock = {
    id: 'p1',
    description: 'teste',
    value: 5,
    idreceiver: '123',
    idsender: '321',
    date: new Date('2024-06-01'),
  };

  const PAYMENT_REPOSITORY_TOKEN = getRepositoryToken(Payment);

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
            sum: jest.fn(),
            manager: {
              transaction: jest.fn(),
            },
          },
        },
        {
          provide: getDataSourceToken(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('paymentsRepository should be defined', () => {
    expect(paymentsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should success', () => {
      jest.spyOn(paymentsRepository, 'save');
      const result = service.create({
        description: paymentMock.description,
        receiver: paymentMock.idreceiver,
        sender: paymentMock.idsender,
        value: paymentMock.value,
      });
      expect(result).resolves.toBe(paymentMock);
    });
  });
});

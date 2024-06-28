import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentsRepository: Repository<Payment>

  const PAYMENT_REPOSITORY_TOKEN = getRepositoryToken(Payment)

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
            sum: jest.fn()
          }
        },
        PaymentsService
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentsRepository = module.get<Repository<Payment>>(PAYMENT_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('paymentsRepository should be defined', () => {
    expect(paymentsRepository).toBeDefined();
  });
});

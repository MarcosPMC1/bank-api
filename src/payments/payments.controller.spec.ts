import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../auth/auth.guard';
import { CanActivate, NotFoundException } from '@nestjs/common';
import { Account } from '../accounts/entities/account.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

const createPaymentDto: CreatePaymentDto = {
    receiver: '11',
    sender: '12',
    value: 5,
    description: 'teste',
}

const payment: Payment = {
  ...createPaymentDto,
  id: '1',
  idreceiver: '11',
  idsender: '12',
  date: new Date('2024-06-01'),
  etag: null,
  location: null,
  receiver: new Account,
  sender: new Account,
}

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: PaymentsService;
  const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn().mockResolvedValue(payment),
            findReport: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('paymentsService should be defined', () => {
    expect(paymentsService).toBeDefined();
  });

  describe('create()', () => {
    it('should success', () => {      
      jest.spyOn(paymentsService, 'create').mockResolvedValueOnce(payment)
      expect(controller.create(createPaymentDto)).resolves.toEqual(payment)
      expect(paymentsService.create).toHaveBeenCalledWith(createPaymentDto)
    })
  })

  describe('findAll()', () => {
    it('should success', () => {
      controller.findAll()
      expect(paymentsService.findAll).toHaveBeenCalled()  
    })
  })

  describe('findOne()', () => {
    it('should success', () => {
      expect(controller.findOne('1')).resolves.toEqual(payment)
      expect(paymentsService.findOne).toHaveBeenCalled()
    })

    it('not found', () => {
      jest.spyOn(paymentsService, 'findOne').mockRejectedValueOnce(new NotFoundException())
      expect(controller.findOne('2')).rejects.toThrow(NotFoundException)
    })
  })

  describe('reportSent()', () => {
    it('should success', () => {
      const dates = { endDate: new Date('2024-06-01'), startDate: new Date('2024-06-01') }
      const report = {
        accountId: '1',
        total: 1,
        payments: [payment],
        ...dates
      }
      jest.spyOn(paymentsService, 'findReport').mockResolvedValueOnce(report)
      expect(
        controller.reportSent('1', dates)
      ).resolves.toEqual(report)
    })
  })
});

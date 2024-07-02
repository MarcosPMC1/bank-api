import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../auth/auth.guard';
import { CanActivate, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';

const createAccountDto: CreateAccountDto = {
  account_type: 'CORRENTE',
  balance: 10,
  name: 'TESTE',
};

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: AccountsService;
  const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            create: jest.fn(() =>
              Promise.resolve({ id: '1', ...createAccountDto }),
            ),
            findAll: jest.fn(),
            findOne: jest.fn((id: string) =>
              Promise.resolve({ id, ...createAccountDto }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('accountsService should be defined', () => {
    expect(accountsService).toBeDefined();
  });

  describe('create()', () => {
    it('should success', () => {
      const result = controller.create(createAccountDto);
      expect(result).resolves.toEqual({ id: '1', ...createAccountDto });
      expect(accountsService.create).toHaveBeenCalledWith(createAccountDto);
    });
  });

  describe('findAll()', () => {
    it('should success', () => {
      controller.findAll();
      expect(accountsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should success', () => {
      const result = controller.findOne('1');
      expect(result).resolves.toEqual({ id: '1', ...createAccountDto });
      expect(accountsService.findOne).toHaveBeenCalled();
    });

    it('not found', () => {
      jest
        .spyOn(controller, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());
      const result = controller.findOne('12');
      expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should success', () => {
      controller.remove('1');
      expect(accountsService.remove).toHaveBeenCalled();
    });
  });
});

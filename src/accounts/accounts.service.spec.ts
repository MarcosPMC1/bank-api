import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { NotFoundException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountRepository: Repository<Account>;
  
  const ACCOUNT_REPOSITORY_TOKEN = getRepositoryToken(Account)

  const accountsMock = [
    { id: '123', account_type: 'CORRENTE', balance: 10, name: 'Marcos' },
    { id: '321', account_type: 'CORRENTE', balance: 10, name: 'Pedro' }
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ACCOUNT_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn((user) => Promise.resolve(user)),
            find: jest.fn(() => Promise.resolve(accountsMock)),
            findOneOrFail: jest.fn(
              (param: { where: { id: string } }) => {
                const id = param.where.id
                const account = accountsMock.find((account) => account.id === id)
                if(!account){
                  return new Promise(() => {throw new NotFoundException()})
                }
                return Promise.resolve(account)
              }
            ),
            create: jest.fn((user) => user),
            softDelete: jest.fn(() => ({}))
          }
        },
        AccountsService
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    accountRepository = module.get<Repository<Account>>(ACCOUNT_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('accountRepository should be defined', () => {
    expect(accountRepository).toBeDefined();
  });

  describe('create', () => {
    it('should success', async () => {
      jest.spyOn(accountRepository, 'save')
      const account: CreateAccountDto = { account_type: 'CORRENTE', balance: 10, name: 'Marcos' }
      const result = service.create(account)
      expect(result).resolves.toBe(account)
    })
  })

  describe('findAll', () => {
    it('should success', () => {
      jest.spyOn(accountRepository, 'find')
      const result = service.findAll()
      expect(result).resolves.toBe(accountsMock)
    })
  })

  describe('findOne', () => {
    it('should success', () => {
      jest.spyOn(accountRepository, 'findOneOrFail')
      const result = service.findOne('123')
      expect(result).resolves.toBe(accountsMock[0])
    })

    it('not found exception', () => {
      jest.spyOn(accountRepository, 'findOneOrFail')
      const result = service.findOne('154')
      expect(result).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should success', () => {
      jest.spyOn(accountRepository, 'softDelete')
      const result = service.remove('123')
      expect(result).resolves.toEqual({ msg: 'Success Deleted' })
    })
  })
});

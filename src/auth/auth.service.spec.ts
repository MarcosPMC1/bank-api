import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const userMock: User = {
    id: '123',
    username: 'Marcos',
    password: '$2a$10$GHnKvBYLUzTD.3CuRs2KEe1RtRWkZuLnRZ.8prcv2bfJjD3GbR7ru'
  }

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn(
              (param: { where: { username: string } }) => {
                const username = param.where.username
                if(userMock.username != username){
                  return undefined
                }
                return Promise.resolve(userMock)
              }
            ),
            create: jest.fn((user) => user),
            save: jest.fn((user): Promise<User> => Promise.resolve({id: '123', ...user})),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(() => 'token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    return
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('User Repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('Login', () => {
    it('should success', () => {
      jest.spyOn(userRepository, 'findOne')
      const result = service.Login('Marcos', 'teste123')
      expect(result).resolves.toEqual({ access_token: 'token' })
    })

    it('should not found', () => {
      jest.spyOn(userRepository, 'findOne')
      const result = service.Login('marcos', 'teste123')

      expect(result).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it('should wrong password', () => {
      jest.spyOn(userRepository, 'findOne')
      const result = service.Login('Marcos', 'teste12')
      expect(result).rejects.toBeInstanceOf(UnauthorizedException)
    })
  })

  describe('Registrate', () => {
    it('should success', () => {
      jest.spyOn(userRepository, 'save')
      const result = service.Registrate('Marcos', 'teste123')
      const { password, ...user } = userMock
      expect(result).resolves.toEqual(user)
    })
  })


});

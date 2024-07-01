import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrateDto } from './dto/registrate.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const userMock: User = {
    id: '123',
    username: 'Marcos',
    password: '$2a$10$GHnKvBYLUzTD.3CuRs2KEe1RtRWkZuLnRZ.8prcv2bfJjD3GbR7ru',
  };

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn((param: { where: { username: string } }) => {
              const username = param.where.username;
              if (userMock.username != username) {
                return undefined;
              }
              return Promise.resolve(userMock);
            }),
            create: jest.fn((user) => user),
            save: jest.fn(
              (user: RegistrateDto): Promise<User> =>
                new Promise((resolve, reject) => {
                  if (user.username == userMock.username) {
                    return reject({ code: '23505' });
                  }
                  return resolve({ id: '321', ...user });
                }),
            ),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('User Repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('Login', () => {
    it('should success', () => {
      const result = service.Login('Marcos', 'teste123');
      expect(result).resolves.toEqual({ access_token: 'token' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'Marcos' },
      });
    });

    it('should not found', () => {
      const result = service.Login('marcos', 'teste123');
      expect(result).rejects.toBeInstanceOf(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'marcos' },
      });
    });

    it('should wrong password', () => {
      const result = service.Login('Marcos', 'teste12');
      expect(result).rejects.toThrow(new UnauthorizedException());
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'Marcos' },
      });
    });
  });

  describe('Registrate', () => {
    it('should success', () => {
      const hashPassword = bcrypt.hashSync('teste123', 10);
      const user = {
        id: '321',
        username: 'Pedro',
      };
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        ...user,
        password: hashPassword,
      });
      const result = service.Registrate('Pedro', 'teste123');
      expect(result).resolves.toEqual(user);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        password: hashPassword,
      });
    });

    it('username already used', () => {
      const hashPassword = bcrypt.hashSync('teste123', 10);
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        id: userMock.id,
        username: userMock.username,
        password: hashPassword,
      });
      const result = service.Registrate('Marcos', 'teste123');
      expect(result).rejects.toBeInstanceOf(BadRequestException);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userMock,
        password: hashPassword,
      });
    });

    it('query error', () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce(new InternalServerErrorException());
      const hashPassword = bcrypt.hashSync('teste123', 10);
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        id: userMock.id,
        username: userMock.username,
        password: hashPassword,
      });
      const result = service.Registrate('Marcos', 'teste123');
      expect(result).rejects.toBeInstanceOf(InternalServerErrorException);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userMock,
        password: hashPassword,
      });
    });
  });
});

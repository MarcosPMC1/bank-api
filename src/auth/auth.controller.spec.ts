import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            Login: jest.fn(),
            Registrate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Login()', () => {
    it('should success', () => {
      jest.spyOn(authService, 'Login').mockResolvedValueOnce({
        access_token: 'token',
      });
      const result = controller.Authenticate({
        username: 'Marcos',
        password: '123',
      });
      expect(result).resolves.toEqual({
        access_token: 'token',
      });
      expect(authService.Login).toHaveBeenCalledWith('Marcos', '123');
    });
  });

  describe('Register()', () => {
    it('should success', () => {
      jest.spyOn(authService, 'Registrate').mockResolvedValueOnce({
        id: '1',
        username: 'Marcos',
        password: '123',
      });
      const result = controller.Register({
        username: 'Marcos',
        password: '123',
      });
      expect(result).resolves.toEqual({
        id: '1',
        username: 'Marcos',
        password: '123',
      });
      expect(authService.Registrate).toHaveBeenCalledWith('Marcos', '123');
    });
  });
});

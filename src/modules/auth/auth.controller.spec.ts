import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/entities/user.entity';


const makeFakeUser = (): UserEntity => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@mail.com'
} as UserEntity)

describe('AuthController', () => {
  let sut: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue(makeFakeUser())
          }
        }
      ],
    }).compile();

    sut = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signUp with correct values', async () => {
      const signUpSpy = jest.spyOn(authService, 'signUp')

      await sut.signUp({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        phone: 'any_phone'
      })

      expect(signUpSpy).toHaveBeenCalledWith({
        data: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
          phone: 'any_phone'
        }
      })
    });

    it('should return a user entity on success', async () => {
      const result = await sut.signUp({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        phone: 'any_phone'
      })

      expect(result).toEqual(makeFakeUser())
    });
  });
});

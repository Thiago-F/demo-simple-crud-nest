import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../../data/entities/user.entity';
import { makeFakeUser } from '../../../test/factories'


// const makeFakeUser = (): UserEntity => ({
//   id: 1,
//   name: 'any_name',
//   email: 'any_email@mail.com'
// } as UserEntity)

const expectedSignUpUser = makeFakeUser()

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
            signUp: jest.fn().mockResolvedValue(expectedSignUpUser),
            login: jest.fn().mockResolvedValue({ access_token: 'any_token' }),
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

      expect(result).toEqual(expectedSignUpUser)
    });
  });

  describe('login', () => {
    it('should call authService.login with correct values', async () => {
      const loginSpy = jest.spyOn(authService, 'login')
      const user = makeFakeUser()

      await sut.login(
        {
          email: 'any_email@mail.com',
          password: 'any_password'
        },
        {
          user
        }
      )

      expect(loginSpy).toHaveBeenCalledWith({
        data: {
          email: 'any_email@mail.com',
          password: 'any_password'
        },
        user
      })
    });

    it('should return a token on success', async () => {
      const response = await sut.login(
        {
          email: 'any_email@mail.com',
          password: 'any_password'
        },
        {
          user: makeFakeUser()
        }
      )

      expect(response).toEqual({ access_token: 'any_token' })
    });
  });
});

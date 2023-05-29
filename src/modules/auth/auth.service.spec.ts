import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../../data/repositories/user-repository';
import { EncryptAdapter } from '../../infra/bcryptAdapter';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../data/entities/user.entity';

const makeFakeUser = (): UserEntity => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@mail.com'
} as UserEntity)

describe('AuthService', () => {
  let sut: AuthService;
  let encryptAdapter: EncryptAdapter;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(makeFakeUser()),
            findOneWithPassword: jest.fn().mockResolvedValue(makeFakeUser()),
            create: jest.fn().mockResolvedValue(makeFakeUser()),
          }
        },
        {
          provide: EncryptAdapter,
          useValue: {
            compare: jest.fn().mockResolvedValue(true),
            hash: jest.fn().mockResolvedValue('hashed_value')
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('any_token')
          }
        }
      ],
    }).compile();

    sut = module.get<AuthService>(AuthService);
    encryptAdapter = module.get<EncryptAdapter>(EncryptAdapter);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user does not found', async () => {
      jest.spyOn(userRepository, 'findOneWithPassword').mockResolvedValueOnce(null)
      const result = await sut.validateUser('any_email@mail.com', 'any_password')
      expect(result).toBeNull()
    });

    it('should throw if password does not match', async () => {
      jest.spyOn(encryptAdapter, 'compare').mockResolvedValueOnce(null)
      const promise = sut.validateUser('any_email@mail.com', 'any_password')
      await expect(promise).rejects.toThrowError(new UnauthorizedException())
    });

    it('should return a user entity without password on success', async () => {
      const result = await sut.validateUser('any_email@mail.com', 'any_password')
      expect(result).toEqual({
        ...makeFakeUser(),
        password: undefined
      })
    });
  });

  describe('signUp', () => {
    it('should throw if password does not match', async () => {
      const promise = sut.signUp({
        data: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'different_password',
          phone: 'any_phone'
        }
      })

      await expect(promise).rejects.toThrowError(new BadRequestException('password does not match with confirm password'))
    });

    it('should call userRepository.create with correct values', async () => {

      const createSpy = jest.spyOn(userRepository, 'create')

      await sut.signUp({
        data: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
          phone: 'any_phone'
        }
      })

      expect(createSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_value',
        phone: 'any_phone'
      })
    });

    it('should return a user entity on success', async () => {
      const result = await sut.signUp({
        data: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
          phone: 'any_phone'
        }
      })

      expect(result).toEqual(makeFakeUser())
    });
  });

  describe('login', () => {
    it('should call jwtService.sign with correct payload', async () => {
      const signSpy = jest.spyOn(jwtService, 'sign')

      await sut.login({
        data: {
          email: 'any_email@mail.com',
          password: 'any_password'
        },
        user: makeFakeUser()
      })

      expect(signSpy).toHaveBeenCalledWith({
        sub: makeFakeUser().id,
        email: makeFakeUser().email,
        name: makeFakeUser().name
      })
    });

    it('should return a access_token on success', async () => {
      const result = await sut.login({
        data: {
          email: 'any_email@mail.com',
          password: 'any_password'
        },
        user: makeFakeUser()
      })

      expect(result).toEqual({
        access_token: 'any_token'
      })
    });
  });
});

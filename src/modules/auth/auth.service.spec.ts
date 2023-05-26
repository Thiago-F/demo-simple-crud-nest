import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../../data/repositories/user-repository';
import { EncryptAdapter } from '../../infra/bcryptAdapter';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';

const makeFakeUser = (): UserEntity => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@mail.com'
} as UserEntity)

describe('AuthService', () => {
  let sut: AuthService;
  let encryptAdapter: EncryptAdapter;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue(makeFakeUser()),
            create: jest.fn()
          }
        },
        {
          provide: EncryptAdapter,
          useValue: {
            compare: jest.fn().mockResolvedValue(true),
            hash: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn()
          }
        }
      ],
    }).compile();

    sut = module.get<AuthService>(AuthService);
    encryptAdapter = module.get<EncryptAdapter>(EncryptAdapter);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user does not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null)
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
});

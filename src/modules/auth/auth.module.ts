import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../../data/repositories/user-repository';
import { EncryptAdapter } from '../../infra/bcryptAdapter';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, EncryptAdapter]
})
export class AuthModule { }

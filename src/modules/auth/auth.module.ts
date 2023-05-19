import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../../data/repositories/user-repository';
import { EncryptAdapter } from '../../infra/bcryptAdapter';
import { LocalStrategy } from './strategy/local.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30d'
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    EncryptAdapter,
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule { }

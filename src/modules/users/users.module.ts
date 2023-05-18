import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from '../../data/repositories/user-repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository]
})
export class UsersModule {}

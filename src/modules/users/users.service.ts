import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserRepository } from '../../data/repositories/user-repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async create({ data, user }: { data: CreateUserDto, user: any }) {
    const { name, email, phone, type } = data
    await this.userRepository.create({
      name,
      email,
      phone,
      type
    })
  }

  async list() {
    return await this.userRepository.findAll({})
  }
}

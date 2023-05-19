import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../data/repositories/user-repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async list() {
    return await this.userRepository.findAll({})
  }
}

import { Controller, Post, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(
    @Body() data: CreateUserDto,
    @Req() request: any
  ) {
    return this.usersService.create({
      data,
      user: request.user
    });
  }
}

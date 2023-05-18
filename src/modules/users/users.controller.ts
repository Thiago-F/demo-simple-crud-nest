import { Controller, Post, Body, Req, Get } from '@nestjs/common';
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

  @Get()
  list() {
    return this.usersService.list()
  }
}

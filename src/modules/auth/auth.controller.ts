import { Body, Controller, HttpCode, HttpStatus, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'
import { LocalAuthGuard } from './guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';


class SignUpDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

class LoginDto {
  email: string;
  password: string;
}


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signUp(
    @Body() data: CreateUserDto
  ) {
    return await this.authService.signUp({
      data
    })
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() data: any,
    @Req() request
  ) {
    console.log('in', data, request.user)

    const { access_token } = await this.authService.login({
      data,
      user: request.user
    })

    return { access_token }
  }
}

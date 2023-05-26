import { Body, Controller, HttpCode, HttpStatus, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signUp(@Body() data: SignUpDto) {
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
    @Body() data: LoginDto,
    @Req() request
  ) {
    const { access_token } = await this.authService.login({
      data,
      user: request.user
    })

    return { access_token }
  }
}

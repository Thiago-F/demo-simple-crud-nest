import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';


class SignUpDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signUp(
    @Body() data: SignUpDto
  ) {
    return await this.authService.signUp({
      data
    })
  }
}

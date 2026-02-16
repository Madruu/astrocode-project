import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { ApiOperation } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in a user' })
  signIn(@Body() signinDto: { email: string; password: string }) {
    return this.authService.signIn(signinDto.email, signinDto.password);
  }
}

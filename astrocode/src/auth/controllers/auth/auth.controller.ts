import { Controller, Post, HttpCode, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoginResponseDTO } from 'src/auth/dto/auth/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @Post('signin')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Sign in a user' })
  signIn(@Req() req: Request & { user: LoginResponseDTO }): LoginResponseDTO {
    return req.user;
  }
}

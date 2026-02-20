import {
  Controller,
  Post,
  HttpCode,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoginResponseDTO } from 'src/auth/dto/auth/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/user/entities/user/user.entity';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Sign in a user' })
  signIn(@Req() req: Request & { user: LoginResponseDTO }): LoginResponseDTO {
    return req.user;
  }

  @Post('signout')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Sign out a user' })
  async signOut(@Req() req: Request & { user: User }): Promise<string> {
    try {
      await this.authService.signOut(req.user.id);
      return 'Logout realizado com sucesso';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

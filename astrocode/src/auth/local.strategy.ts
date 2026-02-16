import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LoginResponseDTO, SignInDto } from 'src/auth/dto/auth/auth.dto';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    email: string,
    password: string,
  ): Promise<LoginResponseDTO> {
    const body = req.body as Partial<SignInDto> | undefined;
    const signinDto: SignInDto = {
      email: body?.email ?? email,
      password: body?.password ?? password,
    };
    const user = await this.authService.signIn(signinDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

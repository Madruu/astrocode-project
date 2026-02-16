import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/entities/auth/auth.entity';
import { LoginResponseDTO, SignInDto } from 'src/auth/dto/auth/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}
  async signIn(signinDto: SignInDto): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { email: signinDto.email },
      select: ['id', 'email', 'password'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(
      signinDto.password,
      user.password,
    );

    if (!user || !passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenMetadata = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(tokenMetadata);

    const result: Auth = await this.authRepository.save({
      token: token,
      type: 'login',
      active: true,
      user: user,
    });
    if (!result) {
      throw new HttpException('Erro ao gerar token', 500);
    }

    return {
      user: user.name,
      token: token,
    };
  }
}

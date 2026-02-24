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
      select: ['id', 'name', 'email', 'password', 'accountType'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      signinDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accountType = user.accountType ?? 'USER';
    const tokenMetadata = {
      sub: user.id,
      email: user.email,
      accountType,
    };

    const token = await this.jwtService.signAsync(tokenMetadata);

    const loginAuth = this.authRepository.create({
      token: token,
      type: 'login',
      active: true,
      user,
    });
    const result: Auth = await this.authRepository.save(loginAuth);
    if (!result) {
      throw new HttpException('Erro ao gerar token', 500);
    }

    return {
      user: user.name,
      token: token,
      accountType,
    };
  }

  async signOut(userId: number, accountType: string): Promise<void> {
    await this.authRepository.delete({ user: { id: userId } });

    const token = await this.jwtService.signAsync({
      sub: userId,
      accountType,
      type: 'logout',
      active: true,
    });
    if (!token) {
      throw new HttpException('Erro ao gerar token', 500);
    }
    const logoutAuth = this.authRepository.create({
      token: token,
      type: 'logout',
      active: true,
      user: { id: userId } as User,
    });
    await this.authRepository.save(logoutAuth);
    if (!token) {
      throw new HttpException('Erro ao gerar token', 500);
    }
  }
}

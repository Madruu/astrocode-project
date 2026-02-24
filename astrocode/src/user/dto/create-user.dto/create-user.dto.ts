import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Match } from '../decorators/match.decorator';
export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'The confirm password of the user' })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'As senhas não coincidem' })
  confirmPassword: string;

  @ApiProperty({
    description: 'The account type of the user',
    required: false,
    enum: ['USER', 'PROVIDER'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['USER', 'PROVIDER'])
  accountType?: string;

  @ApiProperty({
    description: 'Provider CNPJ document',
    required: false,
  })
  @IsOptional()
  @IsString()
  cnpj?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  name?: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsString()
  email?: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  password?: string;

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

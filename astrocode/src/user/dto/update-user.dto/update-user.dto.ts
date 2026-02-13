import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}

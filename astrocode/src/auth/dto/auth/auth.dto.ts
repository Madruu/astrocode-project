import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
    example: 'joao@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    description: 'Password of the user',
    example: 'Teste@123456',
  })
  @IsString()
  password: string;
}

export class LoginResponseDTO {
  user: string;
  token: string;
}

export class tokenMetadataResponse {
  user_id: number;
}

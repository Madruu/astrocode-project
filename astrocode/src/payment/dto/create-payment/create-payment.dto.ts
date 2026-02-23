import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePaymentDto {
  @ApiProperty({ description: 'The user id' })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'The amount of the payment' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'The currency of the payment' })
  @IsNotEmpty()
  @IsString()
  currency: string;
}

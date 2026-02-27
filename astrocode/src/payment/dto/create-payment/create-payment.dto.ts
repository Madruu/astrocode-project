import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePaymentDto {
  @ApiProperty({ description: 'The amount of the payment' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'The currency of the payment' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Optional payment reference', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ description: 'Optional payment description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

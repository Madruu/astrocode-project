import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePayPalCheckoutDto {
  @ApiProperty({ description: 'Deposit amount to charge in checkout' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Checkout currency',
    required: false,
    default: 'BRL',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Checkout intent context',
    required: false,
    enum: ['wallet_deposit', 'external_payment'],
    default: 'wallet_deposit',
  })
  @IsOptional()
  @IsString()
  @IsIn(['wallet_deposit', 'external_payment'])
  purpose?: 'wallet_deposit' | 'external_payment';

  @ApiProperty({
    description: 'Task ID for external_payment (booking checkout)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  taskId?: number;

  @ApiProperty({
    description: 'User ID for external_payment (booking checkout)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({
    description: 'Scheduled date ISO string for external_payment (booking checkout)',
    required: false,
  })
  @IsOptional()
  @IsString()
  scheduledDate?: string;
}

export interface CreatePayPalCheckoutResponse {
  checkoutUrl: string;
  orderId: string;
  paymentReference: string;
}

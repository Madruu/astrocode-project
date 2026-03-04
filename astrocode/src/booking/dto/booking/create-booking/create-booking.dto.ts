import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'The task id' })
  @IsNotEmpty()
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'The user id' })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'The scheduled date' })
  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({
    description: 'How the booking will be paid',
    enum: ['wallet', 'direct'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['wallet', 'direct'])
  paymentMethod: 'wallet' | 'direct';
}

export class CancelBookingDto {
  @ApiProperty({ description: 'The booking id' })
  @IsNotEmpty()
  @IsInt()
  bookingId: number;

  @ApiProperty({ description: 'The reason for cancellation' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class BlockBookingSlotDto {
  @ApiProperty({ description: 'The task id' })
  @IsNotEmpty()
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'The slot to block' })
  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ description: 'Optional reason for slot blocking', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class GetAvailableSlotsQueryDto {
  @ApiProperty({ description: 'The task id' })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'Date in DD/MM/YYYY or YYYY-MM-DD format' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})$/)
  date: string;
}

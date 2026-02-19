import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiProperty({ description: 'The task id' })
  @IsOptional()
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'The scheduled date' })
  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;
}

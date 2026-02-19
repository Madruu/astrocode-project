import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'The task id' })
  @IsNotEmpty()
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'The scheduled date' })
  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;
}

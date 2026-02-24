import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The description of the task' })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The price of the task' })
  @IsNumber()
  price?: number;
}

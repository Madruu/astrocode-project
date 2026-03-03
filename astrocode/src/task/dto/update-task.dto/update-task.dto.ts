import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The description of the task' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The price of the task' })
  @IsOptional()
  @IsNumber()
  price?: number;
}

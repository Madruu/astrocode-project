import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsInt } from 'class-validator';

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

  @ApiProperty({ description: 'The users of the task' })
  @IsArray()
  @IsInt({ each: true })
  users?: number[];
}

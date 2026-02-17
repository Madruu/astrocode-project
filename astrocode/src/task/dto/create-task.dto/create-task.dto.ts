import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The description of the task' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'The price of the task' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The users of the task' })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  users: number[];
}

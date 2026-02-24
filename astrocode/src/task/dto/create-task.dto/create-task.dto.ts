import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';
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
}

export class PurchaseTaskDto {
  @ApiProperty({ description: 'The task id' })
  @IsNotEmpty()
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'The user id' })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}

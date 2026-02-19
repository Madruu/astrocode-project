import {
  Controller,
  Post,
  HttpCode,
  Body,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';
import { Task } from 'src/task/entities/task/task.entity';
import { TaskService } from 'src/task/services/task/task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() task: CreateTaskDto): Promise<Task> {
    try {
      return this.taskService.createTask(task);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all tasks' })
  findAll(): Promise<Task[]> {
    try {
      return this.taskService.findAllTasks();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

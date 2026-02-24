import {
  ForbiddenException,
  Controller,
  Post,
  HttpCode,
  Body,
  Get,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';
import { Task } from 'src/task/entities/task/task.entity';
import { TaskService } from 'src/task/services/task/task.service';
import { Request } from 'express';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new task as provider account' })
  create(
    @Req() req: Request & { user: { userId: number; accountType: string } },
    @Body() task: CreateTaskDto,
  ): Promise<Task> {
    try {
      if (req.user.accountType !== 'PROVIDER') {
        throw new ForbiddenException('Only provider users can create tasks');
      }
      return this.taskService.createTask(task, req.user.userId);
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

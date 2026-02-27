import {
  Delete,
  ForbiddenException,
  Controller,
  Post,
  HttpCode,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto/update-task.dto';
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

  @Put(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a task as provider account' })
  update(
    @Req() req: Request & { user: { userId: number; accountType: string } },
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    try {
      if (req.user.accountType !== 'PROVIDER') {
        throw new ForbiddenException('Only provider users can update tasks');
      }
      return this.taskService.updateTask(id, task, req.user.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a task as provider account' })
  delete(
    @Req() req: Request & { user: { userId: number; accountType: string } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      if (req.user.accountType !== 'PROVIDER') {
        throw new ForbiddenException('Only provider users can delete tasks');
      }
      return this.taskService.deleteTask(id, req.user.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

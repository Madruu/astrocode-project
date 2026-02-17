import { Controller, Post, HttpCode, Body, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';
import { Task } from 'src/task/entities/task/task.entity';
import { TaskService } from 'src/task/services/task/task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() task: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(task);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all tasks' })
  findAll(): Promise<Task[]> {
    return this.taskService.findAllTasks();
  }
}

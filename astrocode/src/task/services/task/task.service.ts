import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task/task.entity';
import { CreateTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';
import { DataSource } from 'typeorm';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto/update-task.dto';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private dataSource: DataSource,
  ) {}

  async findAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findTaskById(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async createTask(taskDto: CreateTaskDto): Promise<Task> {
    const resultTask = await this.dataSource.transaction(
      async (transactionManager) => {
        const newTask = transactionManager.create(Task, {
          ...taskDto,
          users: taskDto.users.map((userId) => ({ id: userId })),
        });
        const savedTask = await transactionManager.save(Task, newTask);
        return savedTask;
      },
    );
    return resultTask;
  }

  async updateTask(id: number, task: UpdateTaskDto): Promise<Task> {
    const resultTask = await this.dataSource.transaction(
      async (transactionManager) => {
        const taskToUpdate = await transactionManager.findOne(Task, {
          where: { id },
          relations: ['users'],
        });
        if (!taskToUpdate) {
          throw new NotFoundException('Task not found');
        }
        return transactionManager.save(Task, {
          ...taskToUpdate,
          ...task,
          users: task.users?.map((userId) => ({ id: userId })) || [],
        });
      },
    );
    return resultTask;
  }

  async deleteTask(id: number): Promise<void> {
    return this.dataSource.transaction(async (transactionManager) => {
      const taskToDelete = await transactionManager.findOne(Task, {
        where: { id },
      });
      if (!taskToDelete) {
        throw new NotFoundException('Task not found');
      }
      await transactionManager.delete(Task, taskToDelete);
    });
  }
}

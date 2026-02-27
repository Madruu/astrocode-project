import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task/task.entity';
import { CreateTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';
import { DataSource } from 'typeorm';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto/update-task.dto';
import { User } from 'src/user/entities/user/user.entity';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['provider'] });
  }

  async findTaskById(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['provider'],
    });
  }

  async createTask(taskDto: CreateTaskDto, providerId: number): Promise<Task> {
    const provider = await this.userRepository.findOne({
      where: { id: providerId },
    });
    if (!provider) {
      throw new NotFoundException('Provider user not found');
    }
    if (provider.accountType !== 'PROVIDER') {
      throw new BadRequestException('Only provider users can create tasks');
    }

    const resultTask = await this.dataSource.transaction(
      async (transactionManager) => {
        const newTask = transactionManager.create(Task, {
          ...taskDto,
          provider,
        });
        const savedTask = await transactionManager.save(Task, newTask);
        return savedTask;
      },
    );
    return resultTask;
  }

  async updateTask(
    id: number,
    task: UpdateTaskDto,
    providerId: number,
  ): Promise<Task> {
    const resultTask = await this.dataSource.transaction(
      async (transactionManager) => {
        const taskToUpdate = await transactionManager.findOne(Task, {
          where: { id },
          relations: ['provider'],
        });
        if (!taskToUpdate) {
          throw new NotFoundException('Task not found');
        }
        this.ensureTaskProviderOwnership(taskToUpdate, providerId);
        return transactionManager.save(Task, {
          ...taskToUpdate,
          ...task,
        });
      },
    );
    return resultTask;
  }

  async deleteTask(id: number, providerId: number): Promise<void> {
    return this.dataSource.transaction(async (transactionManager) => {
      const taskToDelete = await transactionManager.findOne(Task, {
        where: { id },
        relations: ['provider'],
      });
      if (!taskToDelete) {
        throw new NotFoundException('Task not found');
      }
      this.ensureTaskProviderOwnership(taskToDelete, providerId);
      await transactionManager.delete(Task, taskToDelete);
    });
  }

  private ensureTaskProviderOwnership(task: Task, providerId: number): void {
    if (!task.provider || task.provider.id !== providerId) {
      throw new ForbiddenException(
        'You do not have permission to modify this task',
      );
    }
  }
}

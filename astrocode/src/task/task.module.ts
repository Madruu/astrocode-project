import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './controllers/task/task.controller';
import { TaskService } from './services/task/task.service';
import { Task } from 'src/task/entities/task/task.entity';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/entities/user/user.entity';
@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Task, User]), PassportModule],
})
export class TaskModule {}

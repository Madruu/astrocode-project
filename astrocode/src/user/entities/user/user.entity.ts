import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm/browser';
import { Task } from 'src/task/entities/task/task.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('identity', { type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @ManyToMany(() => Task, (task) => task.users)
  @JoinTable({ name: 'user_tasks' })
  tasks: Task[];
}

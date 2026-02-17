import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm';
import { Task } from 'src/task/entities/task/task.entity';
import { Exclude } from 'class-transformer';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('identity', { type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'numeric', default: 0 })
  balance: number = 0;

  @ManyToMany(() => Task, (task) => task.users)
  @JoinTable({ name: 'user_tasks' })
  tasks: Task[];
}

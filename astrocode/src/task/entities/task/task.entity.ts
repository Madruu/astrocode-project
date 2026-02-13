import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from 'src/user/entities/user/user.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('identity', { type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToMany(() => User, (user) => user.tasks)
  users: User[];
}

import { Booking } from 'src/booking/entities/booking/booking.entity';
import { User } from 'src/user/entities/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

const numericTransformer = {
  to: (value: number) => value,
  from: (value: string | number | null): number => Number(value ?? 0),
};

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('identity', { type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'numeric', default: 0, transformer: numericTransformer })
  price: number = 0;

  @ManyToOne(() => User, (provider) => provider.tasksProvided, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  provider: User;

  @OneToMany(() => Booking, (booking) => booking.task)
  bookings: Booking[];
}

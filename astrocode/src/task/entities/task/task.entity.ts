import { Booking } from 'src/booking/entities/booking/booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('identity', { type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'numeric', default: 0 })
  price: number = 0;

  @OneToMany(() => Booking, (booking) => booking.task)
  bookings: Booking[];
}

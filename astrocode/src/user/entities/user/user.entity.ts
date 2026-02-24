import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { OneToMany } from 'typeorm';
import { Booking } from 'src/booking/entities/booking/booking.entity';
import { Payment } from 'src/payment/entities/payment/payment.entity';
import { Task } from 'src/task/entities/task/task.entity';
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

  @Column({ type: 'varchar', default: 'USER' })
  accountType: string;

  @Column({ type: 'varchar', nullable: true })
  cnpj?: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Task, (task) => task.provider)
  tasksProvided: Task[];
}

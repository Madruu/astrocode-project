import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { OneToMany } from 'typeorm';
import { Booking } from 'src/booking/entities/booking/booking.entity';
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

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}

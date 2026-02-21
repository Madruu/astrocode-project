import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('identity', { type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  amount: number;

  @Column({ type: 'varchar' })
  currency: string;
}

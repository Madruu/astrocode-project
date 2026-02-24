import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user/user.entity';
@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn('identity', { type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'varchar', default: 'login' })
  type: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user?: User;
}

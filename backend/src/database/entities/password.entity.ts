import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Password {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  password: string;

  @ManyToOne(
    () => User,
    user => user.id,
  )
  user: number;

  @Column()
  webAddress: string;

  @Column({ length: 100 })
  description: string;

  @Column()
  login: string;
}

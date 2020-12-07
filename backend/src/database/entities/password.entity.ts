import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Password {
  @OneToMany(
    () => SharedPassword,
    sharedPassword => sharedPassword.password,
  )
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  password: string;

  @Column()
  userId?: number;

  @ManyToOne(
    () => User,
    user => user.id,
    { eager: true },
  )
  user?: number;

  @Column()
  webAddress: string;

  @Column({ length: 100 })
  description: string;

  @Column()
  login: string;

  isOwner?: boolean;
}

@Entity()
export class SharedPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(
    () => User,
    user => user.id,
    { eager: true },
  )
  user: number;

  @Column()
  passwordId: number;

  @ManyToOne(
    () => Password,
    password => password.id,
    { eager: true },
  )
  password: number;
}

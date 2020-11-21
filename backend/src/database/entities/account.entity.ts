import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { AlgorithmTypeEnum } from '../constants/algorithmType.const';
import { Password } from './password.entity';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.id,
  )
  user: number;

  @Column()
  blockDate: Date;

  @Column({ default: false })
  isBlocked: boolean;

  @Column()
  blockedAddress: string;

  @Column()
  numberOfWrongLogins: number;
}

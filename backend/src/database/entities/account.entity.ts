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

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  numberOfWrongLogins: number;

  @Column({ nullable: true })
  blockDate: Date;

  @Column({ default: false, nullable: true })
  isBlocked: boolean;

  @Column({ nullable: true })
  lastSuccessLogin: Date;

  @Column({ nullable: true })
  lastFailureLogin: Date;
}

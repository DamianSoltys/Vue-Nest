import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FunctionTypeEnum } from '../constants/accessType.const';
import { User } from './user.entity';

@Entity()
export class HistoryLog {
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
  initializeDate: Date;

  @Column()
  functionType: FunctionTypeEnum;
}

@Entity()
export class DataChange {
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
  initializeDate: Date;

  @Column()
  functionType: FunctionTypeEnum;

  @Column()
  recordId: number;

  @Column()
  previousValue: string;

  @Column()
  presentValue: string;
}

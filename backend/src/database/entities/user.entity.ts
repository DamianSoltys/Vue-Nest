import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AlgorithmTypeEnum } from '../constants/algorithmType.const';
import { Account } from './account.entity';
import { Password } from './password.entity';

@Entity()
export class User {
  @OneToMany(
    () => Password,
    password => password.user,
  )
  @OneToMany(
    () => Account,
    account => account.user,
  )
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  saltOrKey: string;

  @Column()
  algorithmType: AlgorithmTypeEnum;

  @Column()
  numberOfWrongLogins: number;

  @Column()
  blockDate: Date;

  @Column({ default: false })
  isBlocked: boolean;
}

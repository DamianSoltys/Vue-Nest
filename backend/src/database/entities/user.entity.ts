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

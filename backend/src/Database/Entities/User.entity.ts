import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AlgorithmTypeEnum } from '../constants/algorithmType.const';
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
}

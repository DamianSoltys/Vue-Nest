import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AlgorithmTypeEnum } from '../constans/AlgorithmType.const';
import { Password } from './Password.entity';

@Entity()
export class User {
  @OneToMany(
    () => Password,
    password => password.idUser,
  )
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  login: string;

  @Column()
  passwordHash: string;

  @Column()
  saltOrKey: string;

  @Column()
  algorithmType: AlgorithmTypeEnum;
}

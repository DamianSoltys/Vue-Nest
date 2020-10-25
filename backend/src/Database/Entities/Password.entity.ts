import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Password {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @ManyToOne(
    () => User,
    user => user.id,
  )
  idUser: string;

  @Column()
  web_address: string;

  @Column({ length: 100 })
  description: string;

  @Column()
  login: string;
}

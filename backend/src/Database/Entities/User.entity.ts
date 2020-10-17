import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length:100,nullable:false})
  firstName: string;

  @Column({length:100})
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
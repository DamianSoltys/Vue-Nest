import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

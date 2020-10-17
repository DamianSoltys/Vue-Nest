import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { UserEntity } from 'src/Database/Entities/User.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find()
  }

  async addOne(): Promise<InsertResult> {
    const insert = this.usersRepository.createQueryBuilder().insert().into(UserEntity).values({}).execute();

   return insert;
  }
}
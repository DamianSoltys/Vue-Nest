import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from 'src/Database/Entities/User.entity';

@Injectable()
export class UserService {
  private queryBuilder = this.usersRepository.createQueryBuilder();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //TODO: implement
  public async registerUser(): Promise<InsertResult> {
    const insertResult = this.queryBuilder
      .insert()
      .into(User)
      .values({})
      .execute();

    return insertResult;
  }

  //TODO: implement
  public async loginUser(): Promise<InsertResult> {
    const insertResult = this.queryBuilder
      .insert()
      .into(User)
      .values({})
      .execute();

    return insertResult;
  }

  //TODO: implement
  public async changePassword(): Promise<InsertResult> {
    const insertResult = this.queryBuilder
      .insert()
      .into(User)
      .values({})
      .execute();

    return insertResult;
  }
}

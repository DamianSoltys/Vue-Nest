import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from 'src/database/entities/password.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class PasswordService {
  private queryBuilder = this.passwordRepository.createQueryBuilder();

  constructor(
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
  ) {}

  //TODO: implement
  public async getPassword(): Promise<InsertResult> {
    const insertResult = this.queryBuilder
      .insert()
      .into(Password)
      .values({})
      .execute();

    return insertResult;
  }

  //TODO: implement
  public async addPassword(): Promise<InsertResult> {
    const insertResult = this.queryBuilder
      .insert()
      .into(Password)
      .values({})
      .execute();

    return insertResult;
  }

  //TODO: implement
  public async changePassword(): Promise<InsertResult> {
    const insertResult = this.queryBuilder
      .insert()
      .into(Password)
      .values({})
      .execute();

    return insertResult;
  }

  //TODO: implement
  public async deletePassword(): Promise<InsertResult> {
    const insertResult = this.queryBuilder
      .insert()
      .into(Password)
      .values({})
      .execute();

    return insertResult;
  }
}

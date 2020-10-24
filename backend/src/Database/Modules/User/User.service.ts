import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from 'src/Database/Entities/User.entity';
import { RegisterUserDto } from 'src/Database/Dto/user.dto';
import { ConfigService } from '@nestjs/config';
var CryptoJS = require("crypto-js");
@Injectable()
export class UserService {
  private queryBuilder = this.usersRepository.createQueryBuilder();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configSerivce:ConfigService
  ) {}

  //TODO: implement
  public async registerUser({login,password,algorithmType}:RegisterUserDto): Promise<InsertResult> {
    let passwordHash = '';
    let saltOrKey = '';

    if(algorithmType === 'HMAC') {
      saltOrKey = this.configSerivce.get<string>('SECRET_KEY');
      console.log(saltOrKey)

      passwordHash = CryptoJS.HmacSHA512(password,saltOrKey).toString();
    } else {
      saltOrKey = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const pepper = this.configSerivce.get<string>('PEPPER');

      passwordHash = CryptoJS.SHA512(`${pepper}${saltOrKey}${password}`).toString();
    }

    const insertResult = this.queryBuilder
      .insert()
      .into(User)
      .values({login,passwordHash,saltOrKey,algorithmType})
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

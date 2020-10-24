import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from 'src/Database/Entities/User.entity';
import { LoginUserDto, RegisterUserDto } from 'src/Database/Dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { AlgorithmTypeEnum } from 'src/Database/constants/AlgorithmType.const';
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
  public async registerUser({login,password,algorithmType}:RegisterUserDto): Promise<InsertResult> | null {
    let passwordHash = '';
    let saltOrKey = '';

    if(algorithmType === 'HMAC') {
      saltOrKey = this.configSerivce.get<string>('SECRET_KEY');

      passwordHash = CryptoJS.HmacSHA512(password,saltOrKey).toString();
    } else {
      saltOrKey = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const pepper = this.configSerivce.get<string>('PEPPER');

      passwordHash = CryptoJS.SHA512(`${pepper}${saltOrKey}${password}`).toString();
    }

    const searchResult = await this.getUserByLogin(login); 
    let insertResult = null;

    if(!searchResult) {
      insertResult = this.queryBuilder
      .insert()
      .into(User)
      .values({login,passwordHash,saltOrKey,algorithmType})
      .execute();
    }
    
    return insertResult;
  }

  public async getUserByLogin(login:string): Promise<User> {
    const searchResult = this.queryBuilder
      .where("user.login = :login",{login})
      .getOne()

    return searchResult;
  }

  //TODO: implement
  public async loginUser({login,password}:LoginUserDto): Promise<boolean> {
    const searchResult = await this.getUserByLogin(login); 

    if(!searchResult) {
      return false;
    }

    const {saltOrKey,passwordHash} = searchResult;

    if(searchResult.algorithmType === AlgorithmTypeEnum.HMAC) {
      const passwordLoginHash = CryptoJS.HmacSHA512(password,saltOrKey).toString();

      return passwordLoginHash === passwordHash;
    } 

    const pepper = this.configSerivce.get<string>('PEPPER');
    const passwordLoginHash = CryptoJS.SHA512(`${pepper}${saltOrKey}${password}`).toString();

    return passwordLoginHash === passwordHash;
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

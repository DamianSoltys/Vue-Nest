import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from 'src/database/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { AlgorithmTypeEnum } from 'src/database/constants/algorithmType.const';
var CryptoJS = require('crypto-js');

@Injectable()
export class UserService {
  private queryBuilder = this.usersRepository.createQueryBuilder();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configSerivce: ConfigService,
  ) {}

  //TODO: implement
  public async registerUser({
    username,
    password,
    algorithmType,
  }: RegisterUserDto): Promise<InsertResult> | null {
    const { passwordHash, saltOrKey } = this.hashPassword(
      algorithmType,
      password,
    );

    const searchResult = await this.getUserByLogin(username);
    let insertResult = null;

    if (!searchResult) {
      insertResult = this.queryBuilder
        .insert()
        .into(User)
        .values({ username, passwordHash, saltOrKey, algorithmType })
        .execute();
    }

    return insertResult;
  }

  public async getUserByLogin(username: string): Promise<User> {
    const searchResult = this.queryBuilder
      .where('user.username = :username', { username })
      .getOne();

    return searchResult;
  }

  //TODO: implement
  public async loginUser({
    username,
    password,
  }: LoginUserDto): Promise<boolean> {
    const searchResult = await this.getUserByLogin(username);

    if (!searchResult) {
      return false;
    }

    return this.comparePassword(searchResult, password);
  }

  //TODO: add try catch implement changing all passwords
  public async changePassword(
    passwordData: ChangePasswordDto,
  ): Promise<boolean> {
    const searchResult = await this.getUserByLogin(passwordData.username);

    if (!searchResult) {
      return false;
    }

    const comparePassword = this.comparePassword(
      searchResult,
      passwordData.changePassword,
    );

    if (!comparePassword) {
      return false;
    }

    const { passwordHash, saltOrKey } = this.hashPassword(
      searchResult.algorithmType,
      passwordData.changePassword,
    );

    const changeResult = this.queryBuilder
      .update(User)
      .set({ passwordHash, saltOrKey })
      .where('username = :username', { username: searchResult.username })
      .execute();

    if (!changeResult) {
      return false;
    }

    return true;
  }

  public hashPassword(algorithmType: AlgorithmTypeEnum, password: string) {
    let passwordHash = '';
    let saltOrKey = '';

    if (algorithmType === AlgorithmTypeEnum.HMAC) {
      saltOrKey = this.configSerivce.get<string>('SECRET_KEY');

      passwordHash = CryptoJS.HmacSHA512(password, saltOrKey).toString();
    } else {
      saltOrKey = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const pepper = this.configSerivce.get<string>('PEPPER');

      passwordHash = CryptoJS.SHA512(
        `${pepper}${saltOrKey}${password}`,
      ).toString();
    }

    return { passwordHash, saltOrKey };
  }

  public comparePassword(userData: User, password: string) {
    const { saltOrKey, passwordHash } = userData;

    if (userData.algorithmType === AlgorithmTypeEnum.HMAC) {
      const passwordLoginHash = CryptoJS.HmacSHA512(
        password,
        saltOrKey,
      ).toString();

      return passwordLoginHash === passwordHash;
    }

    const pepper = this.configSerivce.get<string>('PEPPER');
    const passwordLoginHash = CryptoJS.SHA512(
      `${pepper}${saltOrKey}${password}`,
    ).toString();

    return passwordLoginHash === passwordHash;
  }
}

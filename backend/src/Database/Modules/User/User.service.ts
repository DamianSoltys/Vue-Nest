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
import { QueryService } from '../shared/query.service';
import { Password } from 'src/database/entities/password.entity';
var CryptoJS = require('crypto-js');

@Injectable()
export class UserService {
  private queryBuilder = this.usersRepository.createQueryBuilder();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configSerivce: ConfigService,
    private queryService: QueryService,
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

    const searchResult = await this.queryService.getUserByLogin(username);
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

  //TODO: implement
  public async loginUser({
    username,
    password,
  }: LoginUserDto): Promise<boolean> {
    const searchResult = await this.queryService.getUserByLogin(username);

    if (!searchResult) {
      return false;
    }

    return this.comparePassword(searchResult, password);
  }

  //TODO: add try catch implement changing all passwords
  public async changePassword(
    passwordData: ChangePasswordDto,
  ): Promise<string> {
    const searchResult = await this.queryService.getUserById(
      passwordData.userId,
    );

    if (!searchResult) {
      return null;
    }

    const comparePassword = this.comparePassword(
      searchResult,
      passwordData.oldPassword,
    );

    if (!comparePassword) {
      return null;
    }

    const { passwordHash, saltOrKey } = this.hashPassword(
      passwordData.algorithmType,
      passwordData.password,
    );

    const changeResult = await this.queryBuilder
      .update(User)
      .set({
        passwordHash,
        saltOrKey,
        algorithmType: passwordData.algorithmType,
      })
      .where('User.id = :id', { id: searchResult.id })
      .execute();

    if (!changeResult) {
      return null;
    }

    const passwords = await this.queryService.getPasswords(
      searchResult.id,
      true,
    );

    passwords.forEach(passwordRow => {
      const decryptOldPassword = CryptoJS.AES.decrypt(
        passwordRow.password,
        passwordData.oldPassword,
      ).toString(CryptoJS.enc.Utf8);

      const password = CryptoJS.AES.encrypt(
        decryptOldPassword,
        passwordData.password,
      ).toString();

      this.queryBuilder
        .update(Password)
        .set({ password })
        .where('password.id = :id', { id: passwordRow.id })
        .execute();
    });

    const key = this.configSerivce.get<string>('SECRET_KEY');
    const secret = CryptoJS.AES.encrypt(passwordData.password, key).toString();

    return secret;
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

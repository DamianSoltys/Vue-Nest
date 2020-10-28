import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IDecryptedPasswordQuery } from 'src/api/locker/locker.interface';
import { AppService } from 'src/app.service';
import { PasswordDto } from 'src/database/Dto/password.dto';
import { Password } from 'src/database/entities/password.entity';
import { InsertResult, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
var CryptoJS = require('crypto-js');

@Injectable()
export class PasswordService {
  private queryBuilder = this.passwordRepository.createQueryBuilder();

  constructor(
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    private userDbService: UserService,
    private appService: AppService,
    private configSerivce: ConfigService,
  ) {}

  //TODO: implement
  public async getPasswords(id: number): Promise<Password[]> {
    const searchResult = await this.queryBuilder
      .where('password.userId = :userId', { userId: id })
      .getMany();

    return searchResult;
  }

  //TODO: implement
  public async addPassword(passwordData: PasswordDto): Promise<InsertResult> {
    const passwordSearchResult = await this.getPasswordByWebAddress(
      passwordData.webAddress,
    );
    const userSearchResult = await this.userDbService.getUserById(
      passwordData.userId,
    );
    let insertResult = null;

    if (!passwordSearchResult && userSearchResult && passwordData.secret) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        passwordData.password,
        this.decryptSecret(passwordData.secret),
      ).toString();

      passwordData.password = encryptedPassword;
      insertResult = this.queryBuilder
        .insert()
        .into(Password)
        .values({ ...passwordData, user: userSearchResult.id })
        .execute();
    }

    return insertResult;
  }

  public async getDecryptedPassword(query: IDecryptedPasswordQuery) {
    const searchResult = await this.getPasswordById(query.passwordId, true);
    console.log(query);
    if (!searchResult && !query.secret) {
      return false;
    }

    console.log(searchResult.password);

    const decryptedPassword = CryptoJS.AES.decrypt(
      searchResult.password,
      this.decryptSecret(query.secret),
    ).toString(CryptoJS.enc.Utf8);
    console.log(decryptedPassword);
    return decryptedPassword;
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

  public decryptSecret(secret: string) {
    const secretKey = this.configSerivce.get<string>('SECRET_KEY');

    return CryptoJS.AES.decrypt(secret, secretKey).toString(CryptoJS.enc.Utf8);
  }

  public async getPasswordByWebAddress(webAddress: string): Promise<Password> {
    const searchResult = this.queryBuilder
      .where('password.webAddress = :webAddress', { webAddress })
      .getOne();

    return searchResult;
  }

  public async getPasswordById(
    id: number,
    withPassword?: boolean,
  ): Promise<Password> {
    const searchResult = withPassword
      ? this.queryBuilder
          .where('password.id = :id', { id })
          .addSelect('Password.password')
          .getOne()
      : this.queryBuilder.where('password.id = :id', { id }).getOne();

    return searchResult;
  }
}

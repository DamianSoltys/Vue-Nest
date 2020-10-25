import { Injectable } from '@nestjs/common';
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
  ) {}

  //TODO: implement
  public async getPasswords(username: string): Promise<Password[]> {
    const searchResult = this.queryBuilder
      .where('password.username = :username', { username })
      .getMany();

    return searchResult;
  }

  //TODO: implement
  public async addPassword(passwordData: PasswordDto): Promise<InsertResult> {
    const passwordSearchResult = await this.getPasswordByWebAddress(
      passwordData.webAddress,
    );
    const userSearchResult = await this.userDbService.getUserByLogin(
      passwordData.username,
    );
    const user = this.appService.users.find(
      user => user.username === passwordData.username,
    );
    let insertResult = null;

    if (!passwordSearchResult && userSearchResult && user) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        passwordData.password,
        user.password,
      );

      passwordData.password = encryptedPassword;
      insertResult = this.queryBuilder
        .insert()
        .into(Password)
        .values({ ...passwordData, idUser: userSearchResult.id })
        .execute();
    }

    return insertResult;
  }

  public async getDecryptedPassword(query: IDecryptedPasswordQuery) {
    const user = this.appService.users.find(
      user => user.username === query.username,
    );
    const searchResult = await this.getPasswordByWebAddress(query.webAddress);

    if (!searchResult && !user) {
      return false;
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      searchResult.password,
      user.password,
    );

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

  public async getPasswordByWebAddress(webAddress: string): Promise<Password> {
    const searchResult = this.queryBuilder
      .where('password.webAddress = :webAddress', { webAddress })
      .getOne();

    return searchResult;
  }
}

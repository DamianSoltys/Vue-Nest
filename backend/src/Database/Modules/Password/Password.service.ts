import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IDecryptedPasswordQuery } from 'src/api/locker/locker.interface';
import { AppService } from 'src/app.service';
import { PasswordDto } from 'src/database/Dto/password.dto';
import { Password } from 'src/database/entities/password.entity';
import { InsertResult, Repository } from 'typeorm';
import { QueryService } from '../shared/query.service';
import { UserService } from '../user/user.service';
var CryptoJS = require('crypto-js');

@Injectable()
export class PasswordService {
  private queryBuilder = this.passwordRepository.createQueryBuilder();

  constructor(
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    private configSerivce: ConfigService,
    private queryService: QueryService,
  ) {}

  //TODO: implement
  public async addPassword(passwordData: PasswordDto): Promise<InsertResult> {
    const userSearchResult = await this.queryService.getUserById(
      passwordData.userId,
    );
    let insertResult = null;

    if (userSearchResult && passwordData.secret) {
      const decryptedUserPassword = this.decryptSecret(passwordData.secret);
      const encryptedPassword = CryptoJS.AES.encrypt(
        passwordData.password,
        decryptedUserPassword,
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
    const searchResult = await this.queryService.getPasswordById(
      query.passwordId,
      true,
    );

    if (!searchResult && !query.secret) {
      return false;
    }
    const decryptedUserPassword = this.decryptSecret(query.secret);
    const decryptedPassword = CryptoJS.AES.decrypt(
      searchResult.password,
      decryptedUserPassword,
    ).toString(CryptoJS.enc.Utf8);

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
}

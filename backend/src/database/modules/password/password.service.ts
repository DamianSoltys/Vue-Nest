import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IDecryptedPasswordQuery } from 'src/api/locker/locker.interface';
import { PasswordDto } from 'src/database/dto/password.dto';
import { Password } from 'src/database/entities/password.entity';
import { InsertResult, Repository } from 'typeorm';
import { QueryService } from '../shared/query.service';
var CryptoJS = require('crypto-js');

@Injectable()
export class PasswordService {
  private passQB = this.passwordRepository.createQueryBuilder();

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
      insertResult = this.passQB
        .insert()
        .into(Password)
        .values({ ...passwordData, user: userSearchResult.id })
        .execute();
    }

    return insertResult;
  }

  public async updatePassword(
    passwordData: PasswordDto,
  ): Promise<InsertResult> {
    const userSearchResult = await this.queryService.getUserById(
      passwordData.userId,
    );
    const passwordSearchResult = await this.queryService.getPasswordById(
      passwordData.id,
    );
    let updateResult = null;

    if (userSearchResult && passwordData.secret && passwordSearchResult) {
      if (passwordData.password) {
        const decryptedUserPassword = this.decryptSecret(passwordData.secret);
        const encryptedPassword = CryptoJS.AES.encrypt(
          passwordData.password,
          decryptedUserPassword,
        ).toString();
        passwordData.password = encryptedPassword;
      }
      const updateData = {
        webAddress: passwordData.webAddress
          ? passwordData.webAddress
          : passwordSearchResult.webAddress,
        login: passwordData.login
          ? passwordData.login
          : passwordSearchResult.login,
        password: passwordData.password
          ? passwordData.password
          : passwordSearchResult.password,
        description: passwordData.description
          ? passwordData.description
          : passwordSearchResult.description,
      };
      const passwordId = passwordData.id;

      updateResult = this.passQB
        .update(Password)
        .set(updateData)
        .where('Password.id = :id', { id: passwordId })
        .execute();
    }

    return updateResult;
  }

  public async deletePassword(passwordId: number) {
    const searchResult = await this.queryService.getPasswordById(passwordId);
    let deleteResult;

    if (searchResult) {
      const deleteResult = this.passQB
        .delete()
        .from(Password)
        .where('Password.id = :id', { id: passwordId })
        .execute();
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Password not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return deleteResult;
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

  public decryptSecret(secret: string) {
    const secretKey = this.configSerivce.get<string>('SECRET_KEY');

    return CryptoJS.AES.decrypt(secret, secretKey).toString(CryptoJS.enc.Utf8);
  }
}

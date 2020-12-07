import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IDecryptedPasswordQuery } from 'src/api/locker/locker.interface';
import {
  PasswordDto,
  SharePasswordDataDto,
} from 'src/database/dto/password.dto';
import {
  Password,
  SharedPassword,
} from 'src/database/entities/password.entity';
import { InsertResult, Repository } from 'typeorm';
import { QueryService } from '../shared/query.service';
var CryptoJS = require('crypto-js');

@Injectable()
export class PasswordService {
  private passQB = this.passwordRepository.createQueryBuilder();
  private sPassQB = this.sharedPasswordRepository.createQueryBuilder();

  constructor(
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    @InjectRepository(SharedPassword)
    private sharedPasswordRepository: Repository<SharedPassword>,
    private configSerivce: ConfigService,
    private queryService: QueryService,
  ) {}

  //TODO: implement
  public async addPassword(passwordData: PasswordDto): Promise<InsertResult> {
    const userSearchResult = await this.queryService.getUserById(
      passwordData.userId,
    );
    let insertResult = null;

    if (userSearchResult) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        passwordData.password,
        userSearchResult.passwordHash,
      ).toString();

      passwordData.password = encryptedPassword;
      insertResult = await this.passQB
        .insert()
        .into(Password)
        .values({ ...passwordData, user: userSearchResult.id })
        .execute();
    }

    return insertResult;
  }

  public async sharePassword({
    username,
    passwordId,
  }: SharePasswordDataDto): Promise<InsertResult> {
    const userSearchResult = await this.queryService.getUserByLogin(username);
    const passwordSearchResult = await this.queryService.getPasswordById(
      passwordId,
    );

    let insertResult = null;

    if (userSearchResult && passwordSearchResult) {
      insertResult = await this.sPassQB
        .insert()
        .into(SharedPassword)
        .values({ userId: userSearchResult.id, passwordId: passwordId })
        .execute();
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `${userSearchResult ? 'User' : 'Password'} not found.`,
        },
        HttpStatus.NOT_FOUND,
      );
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
        const encryptedPassword = CryptoJS.AES.encrypt(
          passwordData.password,
          userSearchResult.passwordHash,
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

      updateResult = await this.passQB
        .update(Password)
        .set(updateData)
        .where('Password.id = :id', { id: passwordId })
        .execute();
    }

    return updateResult;
  }

  public async deletePassword(passwordId: number) {
    const searchResult = await this.queryService.getPasswordById(passwordId);
    const passSearchResult = await this.queryService.getSharedPasswordById(
      passwordId,
    );
    let deleteResult;

    if (passSearchResult) {
      const deleteResult = await this.sPassQB
        .delete()
        .from(SharedPassword)
        .where('passwordId = :passwordId', { passwordId })
        .execute();
    }

    if (searchResult) {
      const deleteResult = await this.passQB
        .delete()
        .from(Password)
        .where('id = :id', { id: passwordId })
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
    const passwordSearchResult = await this.queryService.getPasswordById(
      query.passwordId,
      true,
    );

    const userSearchResult = await this.queryService.getUserById(
      query.userId,
      true,
    );

    if (!passwordSearchResult && !userSearchResult) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Cant decrypt password',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      passwordSearchResult.password,
      userSearchResult.passwordHash,
    ).toString(CryptoJS.enc.Utf8);

    return decryptedPassword;
  }
}

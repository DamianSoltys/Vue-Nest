import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IDecryptedPasswordQuery } from 'src/api/locker/locker.interface';
import { FunctionTypeEnum } from 'src/database/constants/accessType.const';
import {
  PasswordDto,
  SharePasswordDataDto,
} from 'src/database/dto/password.dto';
import { DataChange } from 'src/database/entities/data.entity';
import {
  Password,
  SharedPassword,
} from 'src/database/entities/password.entity';
import { InsertResult, Repository } from 'typeorm';
import { HistoryService } from '../history/history.service';
import { QueryService } from '../shared/query.service';
var CryptoJS = require('crypto-js');

//TODO implement checking if user is owner
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
    private history: HistoryService,
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

    if (insertResult) {
      this.history.addHistoryLog(
        FunctionTypeEnum.ADD_PASSWORD,
        userSearchResult.id,
      );
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

      if (insertResult) {
        this.history.addHistoryLog(
          FunctionTypeEnum.SHARE_PASSWORD,
          userSearchResult.id,
        );
      }
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
    const passwordSearchResultWithPassword = await this.queryService.getPasswordById(
      passwordData.id,true
    );
    let updateResult = null;
    let updateData = null;

    if (userSearchResult && passwordData.secret && passwordSearchResult) {
      if (passwordData.password) {
        const encryptedPassword = CryptoJS.AES.encrypt(
          passwordData.password,
          userSearchResult.passwordHash,
        ).toString();
        passwordData.password = encryptedPassword;
      }

      updateData = {
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

    if (updateResult) {
      const passwordSearchResultWithPasswordAfter = await this.queryService.getPasswordById(
        passwordData.id,true
      );
      
      const previousValue = JSON.stringify(passwordSearchResultWithPassword);
      const presentValue = JSON.stringify(passwordSearchResultWithPasswordAfter);
      
      this.history.addDataChange(FunctionTypeEnum.MODIFY_PASSWORD,previousValue,presentValue)
      this.history.addHistoryLog(
        FunctionTypeEnum.MODIFY_PASSWORD,
        userSearchResult.id,
      );
    }

    return updateResult;
  }

  public async deletePassword(passwordId: number) {
    const searchResult = await this.queryService.getPasswordById(passwordId);
    const passSearchResult = await this.queryService.getSharedPasswordById(
      passwordId,
    );
    const passwordSearchResultWithPassword = await this.queryService.getPasswordById(
      passwordId,true
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

      if (deleteResult) {
        const previousValue = JSON.stringify(passwordSearchResultWithPassword);
        const presentValue = JSON.stringify(null);

        this.history.addDataChange(FunctionTypeEnum.DELETE_PASSWORD,previousValue,presentValue)
        this.history.addHistoryLog(
          FunctionTypeEnum.DELETE_PASSWORD,
          passwordSearchResultWithPassword.userId,
        );
      }
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

    if (decryptedPassword) {
      this.history.addHistoryLog(
        FunctionTypeEnum.SHOW_PASSWORD,
        userSearchResult.id,
      );
    }

    return decryptedPassword;
  }

  public async revertPasswordData(data: DataChange) {
    const previousValue: Password = JSON.parse(data.previousValue);
    const presentValue: Password = JSON.parse(data.presentValue);

    if (presentValue) {
      //ModifyPassword
    } else {
      //AddPassword
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FunctionTypeEnum } from 'src/database/constants/accessType.const';
import { DataChange, HistoryLog } from 'src/database/entities/data.entity';
import {
  Password,
  SharedPassword,
} from 'src/database/entities/password.entity';
import { Repository } from 'typeorm';

//TODO implement checking if user is owner
@Injectable()
export class HistoryService {
  private historyQB = this.historyRepository.createQueryBuilder();
  private changeQB = this.changeRepository.createQueryBuilder();

  constructor(
    @InjectRepository(Password)
    private historyRepository: Repository<HistoryLog>,
    @InjectRepository(SharedPassword)
    private changeRepository: Repository<DataChange>,
  ) {}

  public async addHistoryLog(functionType: FunctionTypeEnum, userId: number) {
    try {
      return await this.historyQB
        .insert()
        .into(HistoryLog)
        .values({ userId, functionType, initializeDate: new Date() })
        .execute();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async addDataChange(
    functionType: FunctionTypeEnum,
    userId: number,
    previousValue: any,
    presentValue: any,
  ) {
    try {
      return await this.changeQB
        .insert()
        .into(DataChange)
        .values({
          userId,
          functionType,
          initializeDate: new Date(),
          previousValue,
          presentValue,
        })
        .execute();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

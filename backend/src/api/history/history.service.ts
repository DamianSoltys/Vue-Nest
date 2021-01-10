import { Injectable } from '@nestjs/common';
import { DataChange, HistoryLog } from 'src/database/entities/data.entity';
import { PasswordService } from 'src/database/modules/password/password.service';
import { QueryService } from 'src/database/modules/shared/query.service';

@Injectable()
export class HistoryControllerService {
  constructor(
    private queryService: QueryService,
    private passwordService: PasswordService,
  ) {}

  async getHistoryLogs(userId: number): Promise<HistoryLog[]> {
    return await this.queryService.getHistoryLog(userId);
  }

  async getDataChanges(recordId: number): Promise<DataChange[]> {
    return await this.queryService.getDataChanges(recordId);
  }

  async modifyData(dataId: number): Promise<boolean> {
    const data = await this.passwordService.revertPasswordData(dataId);

    return data ? true : false;
  }
}

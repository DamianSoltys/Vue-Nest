import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PasswordService } from '../password/password.service';
import { QueryModule } from '../shared/query.module';
import { HistoryService } from './history.service';

@Module({
  imports: [ConfigModule, QueryModule],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryDBModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HistoryService } from '../history/history.service';
import { QueryModule } from '../shared/query.module';
import { PasswordService } from './password.service';

@Module({
  imports: [ConfigModule, QueryModule],
  providers: [PasswordService, HistoryService],
  exports: [PasswordService],
})
export class PasswordDBModule {}

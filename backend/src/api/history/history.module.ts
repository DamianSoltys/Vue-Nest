import { Module } from '@nestjs/common';
import { HistoryDBModule } from 'src/database/modules/history/history.module';
import { PasswordDBModule } from 'src/database/modules/password/password.module';
import { QueryModule } from 'src/database/modules/shared/query.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { HistoryController } from './history.controller';
import { HistoryControllerService } from './history.service';

@Module({
  imports: [HistoryDBModule, QueryModule, AuthModule,PasswordDBModule],
  controllers: [HistoryController],
  providers: [HistoryControllerService],
})
export class HistoryControllerModule {}

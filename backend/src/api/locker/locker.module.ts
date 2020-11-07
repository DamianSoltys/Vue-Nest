import { Module } from '@nestjs/common';
import { PasswordDBModule } from 'src/database/modules/password/password.module';
import { QueryModule } from 'src/database/modules/shared/query.module';
import { LockerController } from './locker.controller';
import { LockerService } from './locker.service';

@Module({
  imports: [PasswordDBModule, QueryModule],
  controllers: [LockerController],
  providers: [LockerService],
})
export class LockerControllerModule {}

import { Module } from '@nestjs/common';
import { PasswordDBModule } from 'src/Database/Modules/Password/Password.module';
import { LockerController } from './locker.controller';
import { LockerService } from './locker.service';

@Module({
  imports: [PasswordDBModule],
  controllers: [LockerController],
  providers: [LockerService],
})
export class LockerControllerModule {}

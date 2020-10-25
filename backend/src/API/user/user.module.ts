import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';

import { UsersDBModule } from 'src/database/modules/user/user.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { UserController } from './user.controller';
import { UserControllerService } from './user.service';

@Module({
  imports: [UsersDBModule, AuthModule],
  controllers: [UserController],
  providers: [UserControllerService, AppService],
})
export class UserControllerModule {}

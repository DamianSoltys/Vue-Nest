import { Module } from '@nestjs/common';

import { UsersDBModule } from 'src/Database/Modules/User/User.module';
import { UserController } from './user.controller';
import { UserControllerService } from './user.service';

@Module({
  imports: [UsersDBModule],
  controllers: [UserController],
  providers: [UserControllerService],
})
export class UserControllerModule {}

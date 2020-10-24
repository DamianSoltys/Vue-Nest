import { Module } from '@nestjs/common';
import { LoginController, RegisterController } from './user.controller';
import { UsersDBModule } from 'src/Database/Modules/User/User.module';
import { UserControllerService } from './user.service';

@Module({
  imports: [UsersDBModule],
  controllers: [LoginController,RegisterController],
  providers: [UserControllerService],
})
export class UserControllerModule {}

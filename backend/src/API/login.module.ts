import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UsersDBModule } from 'src/Database/Modules/User/User.module';

@Module({
  imports: [UsersDBModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}

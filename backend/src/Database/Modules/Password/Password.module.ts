import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from 'src/Database/Entities/Password.entity';
import { UserService } from '../User/User.service';
import { PasswordService } from './Password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  providers: [PasswordService, UserService],
  exports: [TypeOrmModule, PasswordService],
})
export class PasswordDBModule {}

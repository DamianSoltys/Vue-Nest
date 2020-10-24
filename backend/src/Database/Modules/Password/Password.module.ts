import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from 'src/Database/Entities/Password.entity';
import { User } from 'src/Database/Entities/User.entity';
import { UserService } from '../User/User.service';
import { PasswordService } from './Password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password,User]),ConfigModule],
  providers: [PasswordService, UserService],
  exports: [TypeOrmModule, PasswordService],
})
export class PasswordDBModule {}

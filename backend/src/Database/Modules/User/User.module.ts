import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../Entities/User.entity';
import { UserService } from './User.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UsersDBModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from 'nestjs-session';
import { User } from '../../entities/user.entity';
import { QueryModule } from '../shared/query.module';
import { QueryService } from '../shared/query.service';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), QueryModule],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UsersDBModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from 'nestjs-session';
import { Account } from 'src/database/entities/account.entity';
import { User } from '../../entities/user.entity';
import { QueryModule } from '../shared/query.module';
import { QueryService } from '../shared/query.service';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account]),
    QueryModule,
    ConfigModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UsersDBModule {}

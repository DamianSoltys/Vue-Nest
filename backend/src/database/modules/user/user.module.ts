import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueryModule } from '../shared/query.module';
import { UserService } from './user.service';

@Module({
  imports: [QueryModule, ConfigModule],
  providers: [UserService],
  exports: [UserService],
})
export class UsersDBModule {}

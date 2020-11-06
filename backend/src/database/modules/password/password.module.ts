import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { QueryService } from '../shared/query.service';
import { PasswordService } from './password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password, User]), ConfigModule],
  providers: [PasswordService, QueryService],
  exports: [TypeOrmModule, PasswordService],
})
export class PasswordDBModule {}

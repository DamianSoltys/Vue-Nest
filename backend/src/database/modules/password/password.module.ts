import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/database/entities/account.entity';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { QueryModule } from '../shared/query.module';
import { QueryService } from '../shared/query.service';
import { PasswordService } from './password.service';

@Module({
  imports: [ConfigModule, QueryModule],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordDBModule {}

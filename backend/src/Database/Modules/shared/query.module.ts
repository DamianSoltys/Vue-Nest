import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { QueryService } from './query.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password, User]), ConfigModule],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/database/entities/account.entity';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { QueryService } from './query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password, User, Account])],
  providers: [QueryService],
  exports: [QueryService, TypeOrmModule],
})
export class QueryModule {}

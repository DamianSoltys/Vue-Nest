import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { QueryService } from './query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password, User]), ConfigModule],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}

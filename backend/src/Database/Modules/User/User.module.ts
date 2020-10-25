import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from 'nestjs-session';
import { User } from '../../Entities/User.entity';
import { UserService } from './User.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),    
  ],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UsersDBModule {}

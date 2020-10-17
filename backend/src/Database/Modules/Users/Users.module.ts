import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../Entities/User.entity';
import { UsersService } from './Users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers:[UsersService],
  exports: [TypeOrmModule,UsersService]
})
export class UsersDBModule {}
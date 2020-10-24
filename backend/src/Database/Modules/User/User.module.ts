import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from 'nestjs-session';
import { User } from '../../Entities/User.entity';
import { UserService } from './User.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),    
    SessionModule.forRoot({
      session: { secret: 'K2ud78e4ulg8U1NOm0OhuFS5vAbkOBqNHLeESmq4A0qAirUndR' },
    }),
  ],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UsersDBModule {}

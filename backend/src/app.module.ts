import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from 'nestjs-session';
import { LockerControllerModule } from './api/locker/locker.module';
import { UserControllerModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlModule } from './database/configuration/mysql.module';
import { AuthModule } from './shared/auth/auth.module';
import { AuthService } from './shared/auth/auth.service';

@Module({
  imports: [
    LockerControllerModule,
    UserControllerModule,
    MysqlModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

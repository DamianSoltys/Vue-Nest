import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from 'nestjs-session';
import { HistoryControllerModule } from './api/history/history.module';
import { LockerControllerModule } from './api/locker/locker.module';
import { UserControllerModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { MysqlModule } from './database/configuration/mysql.module';

@Module({
  imports: [
    LockerControllerModule,
    UserControllerModule,
    HistoryControllerModule,
    MysqlModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SessionModule.forRoot({
      session: { secret: 'teste', resave: false, saveUninitialized: true },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}

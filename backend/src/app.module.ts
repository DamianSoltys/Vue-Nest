import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from 'nestjs-session';
import { LockerControllerModule } from './API/locker/locker.module';
import { UserControllerModule } from './API/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlModule } from './Database/Configuration/mysql.module';

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

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './API/login.module';
import { MysqlModule } from './Database/Configuration/mysql.module';

@Module({
  imports: [LoginModule,MysqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

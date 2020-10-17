import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConfig } from './MysqlConfig.const';

@Module({
  imports: [TypeOrmModule.forRoot(MysqlConfig)],
  exports: [TypeOrmModule]
})
export class MysqlModule {}

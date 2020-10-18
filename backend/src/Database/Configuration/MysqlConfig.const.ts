import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../Entities/User.entity';

export const MysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'bsi',
  entities: [UserEntity],
  synchronize: true,
};

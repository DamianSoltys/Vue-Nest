import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Password } from '../Entities/Password.entity';
import { User } from '../Entities/User.entity';

export const MysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'bsi',
  entities: [User, Password],
  synchronize: true,
};
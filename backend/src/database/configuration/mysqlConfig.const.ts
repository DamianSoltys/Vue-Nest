import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Password } from '../entities/password.entity';
import { User } from '../entities/user.entity';

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

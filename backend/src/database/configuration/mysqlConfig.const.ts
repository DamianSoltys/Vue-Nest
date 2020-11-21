import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Password } from '../entities/password.entity';
import { User } from '../entities/user.entity';

export const MysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST_IP || 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'bsi',
  entities: [User, Password, Account],
  synchronize: true,
};

import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from 'src/database/dto/user.dto';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import {
  MockAccount,
  MockPassword,
  MockPasswords,
  MockUser,
  MockUsers,
} from './data.mock';

//TODO mock queryBuilder to use real functions instead faked
export class AccountRepositoryFake {
  public createQueryBuilder = jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(MockAccount),
    getOne: jest.fn().mockReturnValue(MockAccount),
  }));
}
export class UserRepostioryFake {
  public createQueryBuilder = jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(MockUsers),
    getOne: jest.fn().mockReturnValue(MockUser),
  }));
}

export class SharedRepositoryFake {
  public createQueryBuilder = jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(null), //TODO return value
    getOne: jest.fn().mockReturnValue(null), //TODO return value
  }));
}

export class PasswordRepositoryFake {
  public createQueryBuilder = jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(MockPasswords),
    getOne: jest.fn().mockReturnValue(MockPassword),
  }));
}

export class ConfigFakeService {
  public get(value: string): string {
    return 'test';
  }
}

export class QueryFakeService {
  public getPasswords = jest.fn(
    (id: number, withPassword?: boolean): Promise<Password[]> => {
      return new Promise((resolve, reject) => {
        resolve(MockPasswords);
      });
    },
  );

  public getPasswordByWebAddress = jest.fn(
    (webAddress: string): Promise<Password> => {
      return new Promise((resolve, reject) => {
        if (webAddress) {
          resolve(MockPassword);
        } else {
          reject(false);
        }
      });
    },
  );

  public getPasswordById = jest.fn(
    (id: number): Promise<Password> => {
      return new Promise((resolve, reject) => {
        if (id) {
          resolve(MockPassword);
        } else {
          reject(false);
        }
      });
    },
  );

  public getUserByLogin = jest.fn(
    (username: string): Promise<User> => {
      return new Promise((resolve, reject) => {
        if (username) {
          resolve(MockUser);
        } else {
          reject(false);
        }
      });
    },
  );

  public getUserById = jest.fn(
    (id: number): Promise<User> => {
      return new Promise((resolve, reject) => {
        if (id) {
          resolve(MockUser);
        } else {
          reject(false);
        }
      });
    },
  );
}

export class UserFakeService {
  public registerUser = jest.fn(
    async (registerData?: RegisterUserDto): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (registerData) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    },
  );

  public loginUser = jest.fn(
    async (loginData?: LoginUserDto): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (loginData) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    },
  );

  public changePassword = jest.fn(
    async (changePasswordData?: ChangePasswordDto): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (changePasswordData) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    },
  );
}

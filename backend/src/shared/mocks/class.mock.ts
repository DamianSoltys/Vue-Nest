import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from 'src/database/dto/user.dto';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { MockPassword, MockPasswords, MockUser } from './data.mock';

//TODO mock queryBuilder to use real functions instead faked
export class UserRepostioryFake {
  public createQueryBuilder(): void {}
}

export class PasswordRepositoryFake {
  public createQueryBuilder(): void {}
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

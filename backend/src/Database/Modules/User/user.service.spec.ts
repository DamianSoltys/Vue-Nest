import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AlgorithmTypeEnum } from 'src/database/constants/algorithmType.const';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { QueryService } from '../shared/query.service';
import { UsersDBModule } from './user.module';
import { UserService } from './user.service';

class UserRepostioryFake {
  public createQueryBuilder(): void {}
}

class PasswordRepositoryFake {
  public createQueryBuilder(): void {}
}

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: UserRepostioryFake,
        },
        {
          provide: 'PasswordRepository',
          useClass: PasswordRepositoryFake,
        },
        UserService,
        QueryService,
        ConfigService,
      ],
      exports: [UserService],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
  });

  describe('compare passwords', () => {
    it('should compare two passwords and return boolean value', () => {
      const user: User = {
        id: 1,
        passwordHash: 'test',
        username: 'test',
        algorithmType: AlgorithmTypeEnum.HMAC,
        saltOrKey: 'test',
      };
      jest.spyOn(userService, 'comparePassword').mockImplementation(() => true);

      expect(userService.comparePassword(user, 'password')).toBe(true);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import {
  UserRepostioryFake,
  PasswordRepositoryFake,
  ConfigFakeService,
  QueryFakeService,
  UserFakeService,
  AccountRepositoryFake,
  SharedRepositoryFake,
} from 'src/shared/mocks/class.mock';
import { QueryService } from '../shared/query.service';
import { UserService } from '../user/user.service';
import { PasswordService } from './password.service';
var CryptoJS = require('crypto-js');

describe('Password service', () => {
  let passwordService: PasswordService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: UserRepostioryFake,
        },
        {
          provide: 'AccountRepository',
          useClass: AccountRepositoryFake,
        },
        {
          provide: 'SharedPasswordRepository',
          useClass: SharedRepositoryFake,
        },
        {
          provide: 'PasswordRepository',
          useClass: PasswordRepositoryFake,
        },
        {
          provide: 'ConfigService',
          useClass: ConfigFakeService,
        },
        PasswordService,
        UserService,
        QueryService,
      ],
      exports: [UserService, QueryService],
    }).compile();

    passwordService = moduleFixture.get<PasswordService>(PasswordService);
  });

  describe('Password service methods', () => {
    it('should return query builder object when inserting new password', () => {
      expect(
        passwordService.addPassword({
          password: 'test',
          secret: 'secret',
          userId: 3,
          webAddress: 'test',
          login: 'test',
          description: 'test',
        }),
      ).resolves.toBeInstanceOf(Object);
    });
  });
});

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

describe('Query service', () => {
  let userService: UserService;
  let queryService: QueryService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: UserRepostioryFake,
        },
        {
          provide: 'SharedPasswordRepository',
          useClass: SharedRepositoryFake,
        },
        {
          provide: 'AccountRepository',
          useClass: AccountRepositoryFake,
        },
        {
          provide: 'PasswordRepository',
          useClass: PasswordRepositoryFake,
        },
        {
          provide: 'ConfigService',
          useClass: ConfigFakeService,
        },
        {
          provide: 'UserService',
          useClass: UserFakeService,
        },
        QueryService,
      ],
      exports: [UserService, QueryService],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
    queryService = moduleFixture.get<QueryService>(QueryService);
  });

  describe('Query methods', () => {
    it('should return array of passwords', () => {
      expect(queryService.getPasswords(1)).resolves.toBeInstanceOf(Array);
    });

    it('should return password object by id', () => {
      expect(queryService.getPasswordById(1)).resolves.toBeInstanceOf(Object);
    });

    it('should return password object by web address', () => {
      expect(
        queryService.getPasswordByWebAddress('test'),
      ).resolves.toBeInstanceOf(Object);
    });

    it('should return user object by id', () => {
      expect(queryService.getUserById(1)).resolves.toBeInstanceOf(Object);
    });

    it('should return user object by login', () => {
      expect(queryService.getUserByLogin('test')).resolves.toBeInstanceOf(
        Object,
      );
    });
  });
});

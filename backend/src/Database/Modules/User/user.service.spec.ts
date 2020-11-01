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

  describe('Sieve of Eratosthenes', () => {
    it('should return array of numbers', () => {
      expect(userService.createNumbersArray(6)).toStrictEqual([2, 3, 4, 5, 6]);
    });

    it('should return empty array', () => {
      expect(userService.createNumbersArray(0)).toStrictEqual([]);
    });

    it('should return set array to object: {"number":true} form', () => {
      const array = userService.createNumbersArray(6);
      const result = { '2': true, '3': true, '4': true, '5': true, '6': true };

      expect(userService.setToTrue(array)).toStrictEqual(result);
    });

    it('should return object with prime numbers set as false: {"prime":false}', () => {
      const array = userService.createNumbersArray(6);
      const primes = userService.setToTrue(array);
      const result = {
        '2': true,
        '3': true,
        '4': false,
        '5': true,
        '6': false,
      };
      userService.findSmallestPrimes(2, 6, primes);

      expect(primes).toStrictEqual(result);
    });

    it('should return empty array when limit is 0', () => {
      expect(userService.sift(0)).toStrictEqual([]);
    });

    it('should return empty array when limit is 1', () => {
      expect(userService.sift(1)).toStrictEqual([]);
    });

    it('should return [2] when limit is 2', () => {
      expect(userService.sift(2)).toStrictEqual([2]);
    });

    it('should return prime numbers with limit of 6', () => {
      const result = [2, 3, 5];

      expect(userService.sift(6)).toStrictEqual(result);
    });

    it('should return prime numbers with limit of 100', () => {
      const result = [
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        41,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97,
      ];

      expect(userService.sift(100)).toStrictEqual(result);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AlgorithmTypeEnum } from 'src/database/constants/algorithmType.const';
import { User } from 'src/database/entities/user.entity';
import {
  UserRepostioryFake,
  PasswordRepositoryFake,
  ConfigFakeService,
  QueryFakeService,
  UserFakeService,
} from 'src/shared/mocks/class.mock';
import { QueryService } from '../shared/query.service';
import { UserService } from './user.service';

describe('User service without mock service', () => {
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
        {
          provide: 'ConfigService',
          useClass: ConfigFakeService,
        },
        QueryService,
        UserService, //use real service to test password functions
      ],
      exports: [UserService],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
  });

  describe('User service methods', () => {
    it('should not register user if there is one with the same data passed to the method', () => {
      expect(
        userService.registerUser({
          username: 'test',
          password: 'test',
          algorithmType: AlgorithmTypeEnum.HMAC,
        }),
      ).resolves.toBe(null);
    });

    it('should login user if there is login data and password matches', () => {
      expect(
        userService.loginUser({ username: 'test', password: 'test' }),
      ).resolves.toBe(true);
    });

    it('should change user password if there is password data and should also return new secret password', () => {
      expect(
        userService
          .changePassword({
            password: 'test',
            oldPassword: 'test',
            userId: 1,
            algorithmType: AlgorithmTypeEnum.HMAC,
          })
          .then(data => typeof data),
      ).resolves.toBe('string');
    });
  });

  describe('Password Methods', () => {
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

    it('should hash good password and compare it to already hashed password', () => {
      const user: User = {
        id: 1,
        passwordHash:
          '9ba1f63365a6caf66e46348f43cdef956015bea997adeb06e69007ee3ff517df10fc5eb860da3d43b82c2a040c931119d2dfc6d08e253742293a868cc2d82015',
        username: 'test',
        algorithmType: AlgorithmTypeEnum.HMAC,
        saltOrKey: 'test',
      };

      expect(userService.comparePassword(user, 'test')).toBe(true);
    });

    it('should hash bad password and compare it to already hashed password', () => {
      const user: User = {
        id: 1,
        passwordHash:
          '9ba1f63365a6caf66e46348f43cdef956015bea997adeb06e69007ee3ff517df10fc5eb860da3d43b82c2a040c931119d2dfc6d08e253742293a868cc2d82015',
        username: 'test',
        algorithmType: AlgorithmTypeEnum.HMAC,
        saltOrKey: 'test',
      };

      expect(userService.comparePassword(user, 'testtt')).toBe(false);
    });

    it('should return object with passwordHash and saltOrKey data', () => {
      const hashedPassword = userService.hashPassword(
        AlgorithmTypeEnum.HMAC,
        'test',
      );

      expect(hashedPassword).toBeInstanceOf(Object);
    });

    it('should return object with passwordHash string data', () => {
      const hashedPassword = userService.hashPassword(
        AlgorithmTypeEnum.HMAC,
        'test',
      );

      expect(typeof hashedPassword.passwordHash).toBe('string');
    });

    it('should return object with saltOrKey string data', () => {
      const hashedPassword = userService.hashPassword(
        AlgorithmTypeEnum.HMAC,
        'test',
      );

      expect(typeof hashedPassword.saltOrKey).toBe('string');
    });

    it('should return two different hashes based on algorithm type', () => {
      const SHAhashedPassword = userService.hashPassword(
        AlgorithmTypeEnum.SHA512,
        'test',
      );

      const HMAChashedPassword = userService.hashPassword(
        AlgorithmTypeEnum.HMAC,
        'test',
      );

      expect(SHAhashedPassword).not.toBe(HMAChashedPassword);
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

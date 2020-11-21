import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from 'src/database/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { AlgorithmTypeEnum } from 'src/database/constants/algorithmType.const';
import { QueryService } from '../shared/query.service';
import { Password } from 'src/database/entities/password.entity';
var CryptoJS = require('crypto-js');

interface PrimesHash {
  [index: number]: boolean;
}

@Injectable()
export class UserService {
  private queryBuilder = this.usersRepository.createQueryBuilder();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configSerivce: ConfigService,
    private queryService: QueryService,
  ) {}

  //TODO: implement
  public async registerUser({
    username,
    password,
    algorithmType,
  }: RegisterUserDto): Promise<InsertResult> | null {
    const { passwordHash, saltOrKey } = this.hashPassword(
      algorithmType,
      password,
    );

    const searchResult = await this.queryService.getUserByLogin(username);
    let insertResult = null;

    if (!searchResult) {
      insertResult = this.queryBuilder
        .insert()
        .into(User)
        .values({ username, passwordHash, saltOrKey, algorithmType })
        .execute();
    }

    return insertResult;
  }

  public async loginUser({
    username,
    password,
  }: LoginUserDto): Promise<boolean> {
    const searchResult = await this.queryService.getUserByLogin(username);

    if (!searchResult) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'User with given cridentials not found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!this.comparePassword(searchResult, password)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Password is incorrect.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  //TODO: add try catch implement changing all passwords
  public async changePassword(
    passwordData: ChangePasswordDto,
  ): Promise<string> {
    const searchResult = await this.queryService.getUserById(
      passwordData.userId,
    );

    if (!searchResult) {
      return null;
    }

    const comparePassword = this.comparePassword(
      searchResult,
      passwordData.oldPassword,
    );

    if (!comparePassword) {
      return null;
    }

    const { passwordHash, saltOrKey } = this.hashPassword(
      passwordData.algorithmType,
      passwordData.password,
    );

    const changeResult = await this.queryBuilder
      .update(User)
      .set({
        passwordHash,
        saltOrKey,
        algorithmType: passwordData.algorithmType,
      })
      .where('User.id = :id', { id: searchResult.id })
      .execute();

    if (!changeResult) {
      return null;
    }

    const passwords = await this.queryService.getPasswords(
      searchResult.id,
      true,
    );

    passwords.forEach(passwordRow => {
      const decryptOldPassword = CryptoJS.AES.decrypt(
        passwordRow.password,
        passwordData.oldPassword,
      ).toString(CryptoJS.enc.Utf8);

      const password = CryptoJS.AES.encrypt(
        decryptOldPassword,
        passwordData.password,
      ).toString();

      this.queryBuilder
        .update(Password)
        .set({ password })
        .where('Password.id = :id', { id: passwordRow.id })
        .execute();
    });

    const key = this.configSerivce.get<string>('SECRET_KEY');
    const secret = CryptoJS.AES.encrypt(passwordData.password, key).toString();

    return secret;
  }

  public hashPassword(algorithmType: AlgorithmTypeEnum, password: string) {
    let passwordHash = '';
    let saltOrKey = '';

    if (algorithmType === AlgorithmTypeEnum.HMAC) {
      saltOrKey = this.configSerivce.get<string>('SECRET_KEY');

      passwordHash = CryptoJS.HmacSHA512(password, saltOrKey).toString();
    } else {
      saltOrKey = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const pepper = this.configSerivce.get<string>('PEPPER');

      passwordHash = CryptoJS.SHA512(
        `${pepper}${saltOrKey}${password}`,
      ).toString();
    }

    return { passwordHash, saltOrKey };
  }

  public comparePassword(userData: User, password: string) {
    const { saltOrKey, passwordHash } = userData;

    if (userData.algorithmType === AlgorithmTypeEnum.HMAC) {
      const passwordLoginHash = CryptoJS.HmacSHA512(
        password,
        saltOrKey,
      ).toString();

      return passwordLoginHash === passwordHash;
    }

    const pepper = this.configSerivce.get<string>('PEPPER');
    const passwordLoginHash = CryptoJS.SHA512(
      `${pepper}${saltOrKey}${password}`,
    ).toString();

    return passwordLoginHash === passwordHash;
  }

  //LABORATORY METHHODS
  public createNumbersArray(limit: number): number[] {
    return Array.from({ length: limit - 1 }, (_v, k) => k + 2);
  }

  public setToTrue(allNums: number[]): PrimesHash {
    return allNums.reduce((hash: PrimesHash, num: number) => {
      hash[num] = true;

      return hash;
    }, {});
  }

  public getUnmarked(primes: PrimesHash): number[] {
    return Object.keys(primes).reduce((array: number[], key) => {
      if (primes[+key] === true) {
        array.push(+key);
      }

      return array;
    }, []);
  }

  public findSmallestPrimes(
    p: number,
    limit: number,
    primes: PrimesHash,
  ): void {
    while (p <= limit) {
      if (primes[p] === true) {
        // Step 3: mark off all multiples of p. We start from p*p as
        // an optimisation
        for (let i = p * p; i <= limit; i += p) {
          primes[i] = false;
        }
      }
      p++;
    }
  }

  public sift(limit: number): number[] {
    if (limit === 2) return [2];

    // Step 1: create an array from 2..limit inclusive
    let allNums: number[] = this.createNumbersArray(limit);

    // Step 2: set p = smallest prime
    let p = 2;

    // create a hash of { number: boolean }, from the array created in step 1,
    // setting every value to true
    let primes: PrimesHash = this.setToTrue(allNums);

    // Step 4: find the next smallest prime and repeat step 3
    this.findSmallestPrimes(p, limit, primes);

    // Step 5: return all unmarked numbers
    return this.getUnmarked(primes);
  }

  public add(x: number, y: number) {
    return x + y;
  }

  public multiply(x: number, y: number) {
    return x * y;
  }
}

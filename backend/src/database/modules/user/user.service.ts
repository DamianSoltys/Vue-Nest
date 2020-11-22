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
import { Account } from 'src/database/entities/account.entity';
var CryptoJS = require('crypto-js');

interface PrimesHash {
  [index: number]: boolean;
}

@Injectable()
export class UserService {
  private userQB = this.userRepository.createQueryBuilder();
  public accQB = this.accountRepository.createQueryBuilder();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
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

    const searchResult = await this.queryService.getUserByLogin(username, true);
    let insertResult = null;

    if (!searchResult) {
      insertResult = this.userQB
        .insert()
        .into(User)
        .values({ username, passwordHash, saltOrKey, algorithmType })
        .execute();
    }

    return insertResult;
  }

  public async loginUser(
    { username, password }: LoginUserDto,
    remoteAddress: string,
  ): Promise<User> {
    const searchResult = await this.queryService.getUserByLogin(username);
    const accountResult = await this.queryService.getAccountDataByAddress(
      remoteAddress,
    );

    this.checkIfBlocked(searchResult, accountResult);

    if (!this.comparePassword(searchResult, password)) {
      this.setUserLoginData(searchResult);
      this.setIpLoginData(accountResult, remoteAddress);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Password is incorrect.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      this.setUserSuccessLoginData(searchResult);
      this.setIpSuccessLoginData(accountResult, remoteAddress);
    }

    return searchResult;
  }

  public async unblockAccount(ipAddress: string): Promise<boolean> {
    const accountResult = await this.queryService.getAccountDataByAddress(
      ipAddress,
    );

    if (!accountResult) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'This ip address is not blocked',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const insertResult = this.accQB
      .update(Account)
      .set({
        isBlocked: false,
        blockDate: null,
        numberOfWrongLogins: null,
      })
      .where('Account.ipAddress = :ipAddress', { ipAddress })
      .execute();

    return true;
  }

  private checkIfBlocked(user: User, account: Account) {
    if (!user || !account) {
      return;
    }

    if (user.isBlocked || account.isBlocked) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error:
            'Your account is blocked permanently, unblock it by clicking on the unblock button.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const blockedDate = user.blockDate || account.blockDate;

    if (blockedDate?.getTime() >= new Date().getTime()) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: `Your account is blocked until ${blockedDate}`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async setUserSuccessLoginData({ id }: User) {
    try {
      const changeResult = await this.userQB
        .update(User)
        .set({
          lastSuccessLogin: new Date(),
          numberOfWrongLogins: null,
          isBlocked: false,
          blockDate: null,
        })
        .where('User.id = :id', { id })
        .execute();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong, try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async setUserLoginData({ numberOfWrongLogins, id }: User) {
    try {
      const wrongLogins = numberOfWrongLogins + 1;
      const changeResult = await this.userQB
        .update(User)
        .set({
          lastFailureLogin: new Date(),
          numberOfWrongLogins: wrongLogins,
          isBlocked: false,
          blockDate:
            wrongLogins === 1 ? null : this.setUserBlockDate(wrongLogins),
        })
        .where('User.id = :id', { id })
        .execute();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong, try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private setIpSuccessLoginData(account: Account, ipAddress?: string) {
    if (!account) {
      const insertResult = this.accQB
        .insert()
        .into(Account)
        .values({
          ipAddress,
          lastFailureLogin: null,
          lastSuccessLogin: new Date(),
          isBlocked: false,
          blockDate: null,
          numberOfWrongLogins: null,
        })
        .execute();
    } else {
      const insertResult = this.accQB
        .update(Account)
        .set({
          lastSuccessLogin: new Date(),
          isBlocked: false,
          blockDate: null,
          numberOfWrongLogins: null,
        })
        .where('Account.ipAddress = :ipAddress', { ipAddress })
        .execute();
    }
  }

  private setIpLoginData(account: Account, ipAddress?: string) {
    if (!account) {
      const insertResult = this.accQB
        .insert()
        .into(Account)
        .values({
          ipAddress,
          lastFailureLogin: new Date(),
          lastSuccessLogin: null,
          isBlocked: false,
          blockDate: null,
          numberOfWrongLogins: 1,
        })
        .execute();
    } else {
      const { numberOfWrongLogins } = account;
      const wrongLogins =
        numberOfWrongLogins === 4
          ? numberOfWrongLogins
          : numberOfWrongLogins + 1;
      const insertResult = this.accQB
        .update(Account)
        .set({
          lastFailureLogin: new Date(),
          numberOfWrongLogins: wrongLogins,
          isBlocked: wrongLogins === 4,
          blockDate:
            wrongLogins === 4 ? null : this.setIpBlockDate(wrongLogins),
        })
        .where('Account.ipAddress = :ipAddress', { ipAddress })
        .execute();
    }
  }

  private setUserBlockDate(numberOfWrongLogins: number) {
    switch (numberOfWrongLogins) {
      case 1: {
        return new Date();
      }
      case 2: {
        return new Date(new Date().getTime() + 2 * 1000);
      }
      case 3: {
        return new Date(new Date().getTime() + 5 * 1000);
      }
      default: {
        return new Date(new Date().getTime() + 2 * 60000);
      }
    }
  }

  private setIpBlockDate(numberOfWrongLogins: number) {
    switch (numberOfWrongLogins) {
      case 2: {
        return new Date(new Date().getTime() + 2 * 1000);
      }
      case 3: {
        return new Date(new Date().getTime() + 5 * 1000);
      }
      default: {
        return new Date();
      }
    }
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

    const changeResult = await this.userQB
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

      this.userQB
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

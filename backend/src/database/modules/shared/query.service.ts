import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/database/entities/account.entity';
import {
  Password,
  SharedPassword,
} from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueryService {
  private userQB = this.userRepository.createQueryBuilder();
  private passQB = this.passwordRepository.createQueryBuilder();
  private sPassQB = this.sharedPasswordRepository.createQueryBuilder();
  private accQB = this.accountRepository.createQueryBuilder();

  constructor(
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    @InjectRepository(SharedPassword)
    private sharedPasswordRepository: Repository<SharedPassword>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  //TODO: implement
  public async getPasswords(
    id: number,
    withPassword?: boolean,
  ): Promise<Password[]> {
    let searchResult: Password[] = null;

    if (withPassword) {
      searchResult = await this.passQB
        .where('Password.userId = :userId', { userId: id })
        .addSelect('Password.password')
        .getMany();
    } else {
      searchResult = await this.passQB
        .where('Password.userId = :userId', { userId: id })
        .getMany();

      searchResult.map(result => {
        return (result.password = null);
      });
    }
    const sharedPassword = await this.getSharedPasswordDataById(id);

    searchResult?.map(password => {
      password.isOwner = true;
    });
    sharedPassword?.map(password => {
      password.isOwner = false;
    });

    searchResult = sharedPassword
      ? [...searchResult, ...sharedPassword]
      : [...searchResult];

    return searchResult;
  }

  public async getPasswordByWebAddress(webAddress: string): Promise<Password> {
    const searchResult = this.passQB
      .where('Password.webAddress = :webAddress', { webAddress })
      .getOne();

    return searchResult;
  }

  public async getPasswordById(
    id: number,
    withPassword?: boolean,
  ): Promise<Password> {
    const searchResult = withPassword
      ? this.passQB
          .where('Password.id = :id', { id })
          .addSelect('Password.password')
          .getOne()
      : this.passQB.where('Password.id = :id', { id }).getOne();

    return searchResult;
  }

  public async getSharedPasswordById(
    passwordId: number,
  ): Promise<SharedPassword> {
    const searchResult = await this.sPassQB
      .where('SharedPassword.passwordId = :passwordId', { passwordId })
      .getOne();

    return searchResult;
  }

  public async getSharedPasswordDataById(userId: number): Promise<Password[]> {
    try {
      const searchResult = await this.passwordRepository
        .createQueryBuilder('password')
        .innerJoin('password.id', 'SharedPassword')
        .where('SharedPassword.userId = :userId', { userId })
        .getMany();

      return searchResult;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Something went wrong with getting shared passwords',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  public async getUserByLogin(
    username: string,
    register?: boolean,
  ): Promise<User> {
    const searchResult = await this.userQB
      .where('User.username = :username', { username })
      .getOne();

    if (!searchResult && !register) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with given cridentials not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (searchResult && register) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'User with given cridentials is already registered.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return searchResult;
  }

  public async getUserById(id: number, register?: boolean): Promise<User> {
    const searchResult = this.userQB.where('User.id = :id', { id }).getOne();

    if (!(await searchResult) && !register) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'User with given cridentials not found.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return searchResult;
  }

  public async getAccountDataByAddress(address: string): Promise<Account> {
    const searchResult = this.accQB
      .where('Account.ipAddress = :address', { address })
      .getOne();

    return searchResult;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from 'src/database/entities/password.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueryService {
  private userQB = this.userRepository.createQueryBuilder();
  private passQB = this.passwordRepository.createQueryBuilder();

  constructor(
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //TODO: implement
  public async getPasswords(
    id: number,
    withPassword?: boolean,
  ): Promise<Password[]> {
    let searchResult = null;

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

  //TODO: implement
  public async getUserByLogin(username: string): Promise<User> {
    const searchResult = this.userQB
      .where('User.username = :username', { username })
      .getOne();

    return searchResult;
  }

  public async getUserById(id: number): Promise<User> {
    const searchResult = this.userQB.where('User.id = :id', { id }).getOne();

    return searchResult;
  }
}

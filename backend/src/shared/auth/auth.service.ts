import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/database/dto/user.dto';
import { User } from 'src/database/entities/user.entity';
import { QueryService } from 'src/database/modules/shared/query.service';
import { UserService } from 'src/database/modules/user/user.service';
var CryptoJS = require('crypto-js');

@Injectable()
export class AuthService {
  constructor(
    private queryService: QueryService,
    private usersDbService: UserService,
    private jwtService: JwtService,
    private configSerivce: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.queryService.getUserByLogin(username);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User with given cridentials not found',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!this.usersDbService.comparePassword(user, password)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Password is incorrect.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { passwordHash, saltOrKey, ...result } = user;

    return result;
  }

  async login(user: User, password?: string): Promise<any> {
    try {
      const payload = { username: user.username, sub: user.algorithmType };
      const key = this.configSerivce.get<string>('SECRET_KEY');
      const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();

      return {
        accessToken: this.jwtService.sign(payload),
        //TODO: session not working properly
        secretToken: encryptedPassword,
        username: payload.username,
        userId: user.id,
      };
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
}

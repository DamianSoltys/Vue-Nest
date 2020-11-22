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

  async validateUser(
    username: string,
    password: string,
    remoteAddress: string,
  ): Promise<any> {
    const searchResult = await this.usersDbService.loginUser(
      {
        username,
        password,
      },
      remoteAddress,
    );

    const { passwordHash, saltOrKey, ...result } = searchResult;

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
        lastFailureLogin: user.lastFailureLogin.toLocaleString(),
        lastSuccessLogin: user.lastSuccessLogin.toLocaleString(),
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

import { Injectable } from '@nestjs/common';
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

    if (user && this.usersDbService.comparePassword(user, password)) {
      const { passwordHash, saltOrKey, ...result } = user;

      return result;
    }
    return null;
  }

  async login(user: User, password?: string) {
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
  }
}

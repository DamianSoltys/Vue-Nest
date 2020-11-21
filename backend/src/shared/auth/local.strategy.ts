import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/database/dto/user.dto';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'localStrategy') {
  constructor(private authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(
    { connection: { remoteAddress } }: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(
      username,
      password,
      remoteAddress,
    );

    return user;
  }
}

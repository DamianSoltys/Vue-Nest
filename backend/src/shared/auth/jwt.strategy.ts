import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/Database/Entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtStrategy') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: any) {
    return { algorithmType: payload.sub, username: payload.username };
  }
}

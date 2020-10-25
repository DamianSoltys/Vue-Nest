import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/database/dto/user.dto';
import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/database/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersDbService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersDbService.getUserByLogin(username);

    if (user && this.usersDbService.comparePassword(user, password)) {
      const { passwordHash, saltOrKey, id, ...result } = user;

      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.algorithmType };

    return {
      access_token: this.jwtService.sign(payload),
      username: payload.username,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './database/dto/user.dto';

@Injectable()
export class AppService {
  //TODO: bad thing :), but session is not working as expected.
  public users: LoginUserDto[] = [];

  getHello(): string {
    return 'Hello World!';
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //TODO: bad thing :), but session is not working as expected.
  public userPassword = null;

  getHello(): string {
    return 'Hello World!';
  }
}

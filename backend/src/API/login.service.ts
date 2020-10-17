import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/Database/Modules/Users/Users.service';

@Injectable()
export class LoginService {
  constructor(private userDBService:UsersService) {}
  getHello(): string {
    return 'Hello Login!';
  }

  async getUsers() {
    const users = await this.userDBService.findAll();

    console.log(users);
  } 

  async addUser() {
    const insertResult = await this.userDBService.addOne();

    console.log(insertResult);
  }
}

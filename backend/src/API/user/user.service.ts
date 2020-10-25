import { Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/database/dto/user.dto';
import { UserService } from 'src/database/modules/user/user.service';

@Injectable()
export class UserControllerService {
  constructor(private userDBService: UserService) {}

  async registerUser(userData: RegisterUserDto): Promise<boolean> {
    const databaseResponse = await this.userDBService.registerUser(userData);

    return databaseResponse ? true : false;
  }

  async loginUser(userData: LoginUserDto): Promise<boolean> {
    const databaseResponse = await this.userDBService.loginUser(userData);

    return databaseResponse ? true : false;
  }
}

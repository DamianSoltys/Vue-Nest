import { Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from 'src/database/dto/user.dto';
import { UserService } from 'src/database/modules/user/user.service';

@Injectable()
export class UserControllerService {
  constructor(private userDBService: UserService) {}

  async registerUser(userData: RegisterUserDto): Promise<boolean> {
    const databaseResponse = await this.userDBService.registerUser(userData);

    return databaseResponse ? true : false;
  }

  async changePassword(passwordData: ChangePasswordDto): Promise<string> {
    const databaseResponse = await this.userDBService.changePassword(
      passwordData,
    );

    return databaseResponse;
  }

  async unblockAccount(ipAddress: string): Promise<boolean> {
    const databaseResponse = await this.userDBService.unblockAccount(ipAddress);

    return databaseResponse;
  }
}

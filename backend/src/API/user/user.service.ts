import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/Database/Dto/user.dto';
import { UserService } from 'src/Database/Modules/User/User.service';

@Injectable()
export class UserControllerService {
  constructor(private userDBService: UserService) {}

  registerUser(userData:RegisterUserDto) {
    this.userDBService.registerUser(userData);
  }
}

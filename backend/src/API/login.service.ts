import { Injectable } from '@nestjs/common';
import { UserService } from 'src/Database/Modules/User/User.service';

@Injectable()
export class LoginService {
  constructor(private userDBService: UserService) {}
}

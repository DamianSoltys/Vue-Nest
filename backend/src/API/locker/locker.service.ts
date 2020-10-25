import { Injectable } from '@nestjs/common';
import { PasswordService } from 'src/database/modules/Password/password.service';

@Injectable()
export class LockerService {
  constructor(private passwordDbService: PasswordService) {}
}

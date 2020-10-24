import { Injectable } from '@nestjs/common';
import { PasswordService } from 'src/Database/Modules/Password/Password.service';

@Injectable()
export class LockerService {
  constructor(private passwordDbService:PasswordService) {}
}

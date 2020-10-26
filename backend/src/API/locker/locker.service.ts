import { Injectable } from '@nestjs/common';
import { PasswordDto } from 'src/database/Dto/password.dto';
import { PasswordService } from 'src/database/modules/Password/password.service';
import { IDecryptedPasswordQuery } from './locker.interface';

@Injectable()
export class LockerService {
  constructor(private passwordDbService: PasswordService) {}

  public getPasswordsFromDatabase(id: number) {
    return this.passwordDbService.getPasswords(id);
  }

  public addPasswordToDatabase(passwordData: PasswordDto) {
    const data = this.passwordDbService.addPassword(passwordData);

    return data ? true : false;
  }

  public getDecryptedPasswordFromDatabase(query: IDecryptedPasswordQuery) {
    return this.passwordDbService.getDecryptedPassword(query);
  }
}

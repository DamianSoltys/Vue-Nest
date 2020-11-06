import { Injectable } from '@nestjs/common';
import { PasswordDto } from 'src/database/Dto/password.dto';
import { PasswordService } from 'src/database/modules/Password/password.service';
import { QueryService } from 'src/database/modules/shared/query.service';
import { IDecryptedPasswordQuery } from './locker.interface';

@Injectable()
export class LockerService {
  constructor(
    private passwordDbService: PasswordService,
    private queryService: QueryService,
  ) {}

  public getPasswordsFromDatabase(id: number) {
    return this.queryService.getPasswords(id);
  }

  public addPasswordToDatabase(passwordData: PasswordDto) {
    const data = this.passwordDbService.addPassword(passwordData);

    return data ? true : false;
  }

  public getDecryptedPasswordFromDatabase(query: IDecryptedPasswordQuery) {
    return this.passwordDbService.getDecryptedPassword(query);
  }
}

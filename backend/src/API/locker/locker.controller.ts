import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { PasswordDto } from 'src/database/Dto/password.dto';
import { IDecryptedPasswordQuery } from './locker.interface';
import { LockerService } from './locker.service';

@Controller('locker')
export class LockerController {
  constructor(private readonly lockerService: LockerService) {}

  @Post('locker')
  async addPassword(@Body() passwordDto: PasswordDto) {
    try {
      return await this.lockerService.addPasswordToDatabase(passwordDto);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong, try again later',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('locker')
  getPasswords(@Query('username') username: string) {
    try {
      return this.lockerService.getPasswordsFromDatabase(username);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong, try again later',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('locker/decrypt')
  async getDecryptedPassword(@Query() query: IDecryptedPasswordQuery) {
    try {
      return this.lockerService.getDecryptedPasswordFromDatabase(query);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong, try again later',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

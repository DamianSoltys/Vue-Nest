import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { PasswordDto } from 'src/database/Dto/password.dto';
import { IDecryptedPasswordQuery } from './locker.interface';
import { LockerService } from './locker.service';

@Controller('locker')
export class LockerController {
  constructor(private readonly lockerService: LockerService) {}

  @Post()
  async addPassword(
    @Body() passwordDto: PasswordDto,
    @Session() session: { password: string },
  ) {
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

  @Get()
  async getPasswords(@Query('userId') id: number) {
    try {
      return await this.lockerService.getPasswordsFromDatabase(id);
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

  @Get('decrypt')
  async getDecryptedPassword(
    @Query() query: IDecryptedPasswordQuery,
    @Headers('Secret') secret: string,
  ) {
    try {
      query.secret = secret;
      return await this.lockerService.getDecryptedPasswordFromDatabase(query);
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

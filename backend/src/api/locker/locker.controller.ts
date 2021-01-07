import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  PasswordDto,
  SharePasswordDataDto,
} from 'src/database/dto/password.dto';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { IDecryptedPasswordQuery } from './locker.interface';
import { LockerService } from './locker.service';

@UseGuards(JwtAuthGuard)
@Controller('locker')
export class LockerController {
  constructor(private readonly lockerService: LockerService) {}

  @Post()
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

  @Put()
  async updatePassowrd(@Body() passwordDto: PasswordDto) {
    try {
      return await this.lockerService.updatePassword(passwordDto);
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

  @Delete()
  async deletePassword(@Query('id') passwordId: number) {
    try {
      return await this.lockerService.deletePassword(passwordId);
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

  @Post('share') async sharePassword(
    @Body() passwordData: SharePasswordDataDto,
  ) {
    try {
      return await this.lockerService.sharePassword(passwordData);
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

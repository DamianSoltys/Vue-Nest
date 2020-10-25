import { Body, Controller, Get, Post } from '@nestjs/common';
import { PasswordDto } from 'src/database/Dto/password.dto';
import { LockerService } from './locker.service';

@Controller('locker')
export class LockerController {
  constructor(private readonly lockerService: LockerService) {}

  @Post()
  addPassword(@Body() passwordDto: PasswordDto) {}
}

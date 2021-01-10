import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { HistoryControllerService } from './history.service';

@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly history: HistoryControllerService) {}

  @Get()
  async getHistoryLogs(@Query('userId') id: number) {
    try {
      return await this.history.getHistoryLogs(id);
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

  @Get('changes')
  async getDataChanges(@Query('recordId') id: number) {
    try {
      return await this.history.getDataChanges(id);
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

  @Post('changes')
  async modifyData(@Body() { dataId }: { dataId: number }) {
    try {
      return await this.history.modifyData(dataId);
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

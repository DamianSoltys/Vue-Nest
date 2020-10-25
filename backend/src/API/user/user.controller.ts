import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Session,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from 'src/app.service';
import { LoginUserDto, RegisterUserDto } from 'src/database/dto/user.dto';
import { AuthService } from 'src/shared/auth/auth.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/shared/auth/local-auth.guard';
import { IUserSession } from './user.interface';
import { UserControllerService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserControllerService,
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    @Body() loginData: LoginUserDto,
    @Request() req,
  ): Promise<{ accessToken: string }> {
    try {
      const status = await this.userService.loginUser(loginData);

      if (status) {
        this.appService.users.push(loginData);
      }

      console.log(this.appService.users);

      return this.authService.login(req.user);
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

  @Post('register')
  async registerUser(@Body() registerData: RegisterUserDto): Promise<boolean> {
    try {
      return this.userService.registerUser(registerData);
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

  @UseGuards(JwtAuthGuard)
  @Get()
  test(): string {
    console.log(this.appService.users);
    return JSON.stringify('hello');
  }
}

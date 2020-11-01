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
  Put,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from 'src/database/dto/user.dto';
import { AuthService } from 'src/shared/auth/auth.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/shared/auth/local-auth.guard';
import { UserControllerService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserControllerService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    @Body() loginData: LoginUserDto,
    @Session() session: { password: string },
    @Request() req,
  ): Promise<{ accessToken: string }> {
    try {
      const status = await this.userService.loginUser(loginData);

      if (status) {
        session.password = loginData.password;
      }

      return this.authService.login(req.user, loginData.password);
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

  @Put('password')
  async changePassword(
    @Body() passwordData: ChangePasswordDto,
  ): Promise<string> {
    try {
      return this.userService.changePassword(passwordData);
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

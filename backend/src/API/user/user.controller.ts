import { Body, Controller, Get, HttpException, HttpStatus, Post, Session } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/Database/Dto/user.dto';
import { IUserSession } from './user.interface';
import { UserControllerService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserControllerService) {}

  @Post('login')
  async loginUser(@Session() session: { user:IUserSession },@Body() loginData:LoginUserDto): Promise<boolean>  {
    try {
      const status = await this.userService.loginUser(loginData);

      if(status) {
        session.user = loginData;
      }

      console.log(session)

      return status;
    } catch {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Something went wrong, try again later',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async registerUser(@Body() registerData:RegisterUserDto): Promise<boolean> {
    try {
      return this.userService.registerUser(registerData);
    } catch {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Something went wrong, try again later',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  test(): string {
    return JSON.stringify('hello');
  }
}


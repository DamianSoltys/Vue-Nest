import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/Database/Dto/user.dto';
import { IUserSession } from './user.interface';
import { UserControllerService } from './user.service';

@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserControllerService) {}

  @Post()
  loginUser(@Body() loginData:LoginUserDto): string {
    const test = {
      data:'tete',
      data1:'tete'
    }

    return JSON.stringify(test);
  }

  @Get()
  test(): string {
    return JSON.stringify('hello');
  }
}

@Controller('register')
export class RegisterController {
  constructor(private readonly userService: UserControllerService) {}

  @Post()
  registerUser(@Session() session: { user:IUserSession },@Body() registerData:RegisterUserDto): string {
    this.userService.registerUser(registerData);
    return 'test';
  }
}

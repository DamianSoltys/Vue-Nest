import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/Database/Dto/user.dto';
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
  registerUser(@Body() registerData:RegisterUserDto): string {
    this.userService.registerUser(registerData);
    return 'test';
  }
}

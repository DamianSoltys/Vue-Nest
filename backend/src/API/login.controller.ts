import { Controller, Get } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  getHello(): string {
    this.loginService.getUsers();
   this.loginService.addUser();
   this.loginService.getUsers();

   return 'hello';
  }
}

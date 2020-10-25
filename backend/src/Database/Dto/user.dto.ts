import { AlgorithmTypeEnum } from '../constants/algorithmType.const';

export class LoginUserDto {
  username: string;
  password: string;
}

export class RegisterUserDto {
  username: string;
  password: string;
  algorithmType: AlgorithmTypeEnum;
}

export class ChangePasswordDto {
  username: string;
  password: string;
  changePassword: string;
}

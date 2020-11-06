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
  userId: number;
  oldPassword: string;
  password: string;
  algorithmType: AlgorithmTypeEnum;
}

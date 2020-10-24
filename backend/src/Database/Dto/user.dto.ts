import { AlgorithmTypeEnum } from "../constants/AlgorithmType.const";

export class LoginUserDto {
  login: string;
  password: string;
}

export class RegisterUserDto {
  login: string;
  password: string;
  algorithmType: AlgorithmTypeEnum;
}
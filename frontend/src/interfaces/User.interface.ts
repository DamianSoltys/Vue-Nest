export interface ILoginData {
  username: string;
  password: string;
}

export interface IRegisterData extends ILoginData {
  passwordConfirm: string;
  algorithmType: string;
}

export interface ILoginResponse {
  accessToken: string;
  username: string;
  secretToken: string;
  userId: number;
}

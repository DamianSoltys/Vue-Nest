export interface ILoginData {
  username: string;
  password: string;
}

export interface IRegisterData extends ILoginData {
  passwordConfirm: string;
  algorithmType: string;
}

export interface ILoginResponse {
  access_token: string;
  username: string;
}

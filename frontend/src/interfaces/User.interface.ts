export interface ILoginData {
  login:string;
  password:string;
}

export interface IRegisterData extends ILoginData {
  passwordConfirm:string;
  algorithmType:string;
}
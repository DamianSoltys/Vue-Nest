export interface IPasswordData {
  secret: string | null;
  userId: number;
  webAddress: string;
  login: string;
  password: string;
  description: string;
}

export interface IChangePasswordData {
  userId: string;
  password: string;
  changePassword: string;
}

export interface IPasswordsList {
  description: string;
  id: number;
  login: string;
  username: string;
  webAddress: string;
}

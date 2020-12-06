export interface IPasswordData {
  id?: number;
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
  oldPassword: string;
  algorithmType: string;
}

export interface IPasswordsList {
  description: string;
  id: number;
  login: string;
  username: string;
  webAddress: string;
  password?: string | null;
}

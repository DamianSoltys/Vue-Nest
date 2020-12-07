export interface IPasswordData {
  id?: number;
  secret: string | null;
  userId: number;
  webAddress: string;
  login: string;
  password: string;
  description: string;
  isOwner?: boolean;
}

export interface IChangePasswordData {
  userId: string;
  password: string;
  oldPassword: string;
  algorithmType: string;
}

export interface IDecryptPasswordData {
  passwordId: number;
  userId: number;
}

export interface ISharePasswordData {
  username: string;
  passwordId: number;
}

export interface IPasswordsList {
  description: string;
  id: number;
  login: string;
  username: string;
  webAddress: string;
  password?: string | null;
}

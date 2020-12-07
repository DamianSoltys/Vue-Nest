export class PasswordDto {
  id?: number;
  secret?: string;
  userId: number;
  webAddress: string;
  login: string;
  password: string;
  description: string;
}

export interface SharePasswordDataDto {
  username: string;
  passwordId: number;
}

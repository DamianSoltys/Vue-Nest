import { IPasswordsList } from "@/interfaces/password.interface";

export interface IInitalState {
  username: string;
  logged: boolean;
  userId: number | null;
  passwords: IPasswordsList[];
}

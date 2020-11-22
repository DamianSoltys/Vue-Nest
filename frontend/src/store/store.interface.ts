import { IPasswordsList } from "@/interfaces/password.interface";

export interface IInitalState {
  username: string;
  logged: boolean;
  userId: number | null;
  passwords: IPasswordsList[];
  lastFailureLogin: string | null;
  lastSuccessLogin: string | null;
}

export const StoreActions = {
  CHECK_AUTH: "[USER]CHECK_AUTH",
  TOGGLE_UNBLOCK_BUTTON: "[USER]TOGGLE_UNBLOCK_BUTTON",
  UNBLOCK_ACCOUNT: "[USER]UNBLOCK_ACCOUNT",
  LOGIN_USER: "[USER]LOGIN_USER",
  LOGOUT_USER: "[USER]LOGOUT_USER",
  REGISTER_USER: "[USER]REGISTER_USER",
  CHANGE_PASSWORD: "[USER]CHANGE_PASSWORD",
  ADD_PASSWORD: "[PASSWORD]ADD_PASSWORD",
  GET_PASSWORDS: "[PASSWORD]GET_PASSWORDS",
  DECRYPT_PASSWORD: "[PASSWORD]DECRYPT_PASSWORD",
  RESPONSE_ERROR: "[TOAST]RESPONSE_ERROR",
  RESPONSE_SUCCESS: "[TOAST]RESPONSE_SUCCESS"
};

export const StoreMutations = {
  SET_PASSWORDS: "SET_PASSWORDS",
  CHANGE_LOGGED: "CHANGE_LOGGED",
  CLEAR_STORE: "CLEAR_STORE"
};

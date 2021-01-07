import { IDataChange, IHistoryLog } from "@/interfaces/history.interface";
import { IPasswordData, IPasswordsList } from "@/interfaces/password.interface";

export enum SiteModeEnum {
  EDIT = "EDIT",
  READONLY = "READONLY"
}
export interface IInitalState {
  username: string;
  logged: boolean;
  userId: number | null;
  passwords: IPasswordsList[];
  lastFailureLogin: string | null;
  lastSuccessLogin: string | null;
  mode: SiteModeEnum;
  editData: IPasswordData | null;
  history: IHistoryLog[];
  dataChanges: IDataChange[];
}

export const StoreActions = {
  CHECK_AUTH: "[USER]CHECK_AUTH",
  TOGGLE_SITE_MODE: "[USER]TOGGLE_SITE_MODE",
  TOGGLE_UNBLOCK_BUTTON: "[USER]TOGGLE_UNBLOCK_BUTTON",
  UNBLOCK_ACCOUNT: "[USER]UNBLOCK_ACCOUNT",
  LOGIN_USER: "[USER]LOGIN_USER",
  LOGOUT_USER: "[USER]LOGOUT_USER",
  REGISTER_USER: "[USER]REGISTER_USER",
  CHANGE_PASSWORD: "[USER]CHANGE_PASSWORD",
  ADD_PASSWORD: "[PASSWORD]ADD_PASSWORD",
  GET_PASSWORDS: "[PASSWORD]GET_PASSWORDS",
  GET_HISTORY: "[HISTORY]GET_HISTORY",
  GET_CHANGES: "[PASSWORD]GET_CHANGES",
  SET_MODIFY_PASSWORD: "[PASSWORD]SET_MODIFY_PASSWORD",
  MODIFY_PASSWORD: "[PASSWORD]MODIFY_PASSWORD",
  SHARE_PASSWORD: "[PASSWORD]SHARE_PASSWORD",
  DELETE_PASSWORD: "[PASSWORD]DELETE_PASSWORD",
  DECRYPT_PASSWORD: "[PASSWORD]DECRYPT_PASSWORD",
  RESPONSE_ERROR: "[TOAST]RESPONSE_ERROR",
  RESPONSE_SUCCESS: "[TOAST]RESPONSE_SUCCESS"
};

export const StoreMutations = {
  SET_PASSWORDS: "SET_PASSWORDS",
  SET_HISTORY: "SET_HISTORY",
  SET_CHANGES: "SET_CHANGES",
  SET_MODIFY_PASSWORD: "SET_MODIFY_PASSWORD",
  TOGGLE_SITE_MODE: "TOGGLE_SITE_MODE",
  CHANGE_LOGGED: "CHANGE_LOGGED",
  CLEAR_STORE: "CLEAR_STORE"
};

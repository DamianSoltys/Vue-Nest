import {
  IChangePasswordData,
  IPasswordData,
  IPasswordsList
} from "@/interfaces/password.interface";
import {
  ILoginData,
  ILoginResponse,
  IRegisterData
} from "@/interfaces/user.interface";
import { passwordService } from "@/services/password.service";
import { userService } from "@/services/user.service";
import { Action, ActionContext, createStore, Store } from "vuex";
import { IInitalState, StoreMutations, StoreActions } from "./store.interface";
import store from "../store/vuex.config";

export const initialState = {
  username: "User",
  logged: false,
  passwords: [],
  userId: null,
  lastFailureLogin: null,
  lastSuccessLogin: null
};

export async function loginUser(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: ILoginData
): Promise<ILoginResponse> {
  const data = await userService.loginUser(payload);

  commit(StoreMutations.CHANGE_LOGGED, data);

  return data;
}

export async function registerUser(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IRegisterData
): Promise<boolean> {
  return await userService.registerUser(payload);
}

export function logoutUser({
  commit
}: ActionContext<IInitalState, IInitalState>): boolean {
  commit(StoreMutations.CLEAR_STORE);
  return userService.logoutUser();
}

export function checkAuth({
  commit
}: ActionContext<IInitalState, IInitalState>): boolean {
  commit(StoreMutations.CHANGE_LOGGED, {
    username: userService.getName(),
    lastSuccessLogin: userService.getDates().lastSuccessLogin,
    lastFailureLogin: userService.getDates().lastFailureLogin,
    userId: userService.getUserId(),
    accessToken: userService.getToken()
  });

  return !!userService.getToken();
}

//TODO: implement
export async function addPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IPasswordData
): Promise<boolean> {
  return await passwordService.addPassword(payload);
}

//TODO: implement
export async function getPasswords({
  commit,
  state
}: ActionContext<IInitalState, IInitalState>): Promise<IPasswordData[]> {
  const data = await passwordService.getPasswords();

  commit(StoreMutations.SET_PASSWORDS, data);

  return data;
}

//TODO: implement
export async function getDecryptedPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: string
): Promise<string> {
  return await passwordService.getDecryptedPassword(payload);
}

//TODO: implement
export async function changePassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IChangePasswordData
): Promise<boolean> {
  return await userService.changePassword(payload);
}

//TODO: implement
export async function unblockAccount({
  commit,
  state
}: ActionContext<IInitalState, IInitalState>): Promise<boolean> {
  const data = await userService.unblockAccount();

  if (data) {
    store.dispatch(StoreActions.TOGGLE_UNBLOCK_BUTTON, false);
  }

  return data;
}

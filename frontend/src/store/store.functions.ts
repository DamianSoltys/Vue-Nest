import {
  IChangePasswordData,
  IDecryptPasswordData,
  IPasswordData,
  IPasswordsList,
  ISharePasswordData
} from "@/interfaces/password.interface";
import {
  ILoginData,
  ILoginResponse,
  IRegisterData
} from "@/interfaces/user.interface";
import { passwordService } from "@/services/password.service";
import { userService } from "@/services/user.service";
import { Action, ActionContext, createStore, Store } from "vuex";
import {
  IInitalState,
  StoreMutations,
  StoreActions,
  SiteModeEnum
} from "./store.interface";
import store from "../store/vuex.config";
import router from "@/router/router";
import { IDataChange, IHistoryLog } from "@/interfaces/history.interface";
import { historyService } from "@/services/history.service";

export const initialState: IInitalState = {
  username: "User",
  logged: false,
  passwords: [],
  userId: null,
  lastFailureLogin: null,
  lastSuccessLogin: null,
  mode: SiteModeEnum.READONLY,
  editData: null,
  history: [],
  dataChanges: []
};

export async function toggleSiteMode(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: SiteModeEnum
) {
  commit(StoreMutations.TOGGLE_SITE_MODE, payload);
}

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

export async function revertChanges(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: number
): Promise<boolean> {
  const data = await historyService.revertData(payload);
  
  store.dispatch(StoreActions.GET_PASSWORDS);
  return data;
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

export async function getHistory({
  commit,
  state
}: ActionContext<IInitalState, IInitalState>): Promise<IHistoryLog[]> {
  const data = await historyService.getHistory();

  commit(StoreMutations.SET_HISTORY, data);

  return data;
}

export async function getDataChanges(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: number
): Promise<IDataChange[]> {
  const data = await historyService.getDataChanges(payload);

  commit(StoreMutations.SET_CHANGES, data);

  return data;
}

export async function setModifyPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IPasswordData
) {
  router.push("/password/new-password");
  commit(StoreMutations.SET_MODIFY_PASSWORD, payload);
}

export async function updatePassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IPasswordData
) {
  const data = await passwordService.updatePassword(payload);
}

export async function deletePasword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: number
) {
  const data = await passwordService.deletePassword(payload);
  
  store.dispatch(StoreActions.GET_PASSWORDS);
  return data;
}

//TODO: implement
export async function getDecryptedPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IDecryptPasswordData
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

export async function sharePassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: ISharePasswordData
): Promise<boolean> {
  return await passwordService.sharePassword(payload);
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

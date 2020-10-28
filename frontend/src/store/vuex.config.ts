import {
  IChangePasswordData,
  IPasswordData,
  IPasswordsList
} from "@/interfaces/password.interface";
import {
  ILoginData,
  ILoginResponse,
  IRegisterData
} from "@/interfaces/User.interface";
import { passwordService } from "@/services/password.service";
import { userService } from "@/services/user.service";
import { Action, ActionContext, createStore, Store } from "vuex";
import { IInitalState, StoreMutations, StoreActions } from "./store.interface";

const initialState = {
  username: "User",
  logged: false,
  passwords: [],
  userId: null
};

async function loginUser(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: ILoginData
): Promise<ILoginResponse> {
  const data = await userService.loginUser(payload);

  commit(StoreMutations.CHANGE_LOGGED, data);

  return data;
}

async function registerUser(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IRegisterData
): Promise<boolean> {
  return await userService.registerUser(payload);
}

function logoutUser({
  commit
}: ActionContext<IInitalState, IInitalState>): boolean {
  commit(StoreMutations.CLEAR_STORE);
  return userService.logoutUser();
}

function checkAuth({
  commit
}: ActionContext<IInitalState, IInitalState>): boolean {
  commit(StoreMutations.CHANGE_LOGGED, {
    username: userService.getName(),
    userId: userService.getUserId(),
    accessToken: userService.getToken()
  });

  return !!userService.getToken();
}

//TODO: implement
async function addPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IPasswordData
): Promise<boolean> {
  return await passwordService.addPassword(payload);
}

//TODO: implement
async function getPasswords({
  commit,
  state
}: ActionContext<IInitalState, IInitalState>): Promise<IPasswordData[]> {
  const data = await passwordService.getPasswords();

  commit(StoreMutations.SET_PASSWORDS, data);

  return data;
}

//TODO: implement
async function getDecryptedPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: string
): Promise<boolean> {
  return await passwordService.getDecryptedPassword(payload);
}

//TODO: implement
async function changePassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IChangePasswordData
): Promise<boolean> {
  return await userService.changePassword(payload);
}

export default createStore({
  state(): IInitalState {
    return { ...initialState };
  },
  mutations: {
    [StoreMutations.SET_PASSWORDS]: (
      state: IInitalState,
      payload: IPasswordsList[]
    ) => {
      state.passwords = payload;
    },
    [StoreMutations.CHANGE_LOGGED]: (
      state: IInitalState,
      payload: ILoginResponse
    ) => {
      state.username = payload?.username || "User";
      state.logged = !!payload?.accessToken || false;
      state.userId = payload?.userId || null;
    },
    [StoreMutations.CLEAR_STORE]: (state: IInitalState) => {
      state.logged = initialState.logged;
      state.username = initialState.username;
      state.userId = initialState.userId;
    }
  },
  actions: {
    [StoreActions.CHECK_AUTH]: context => checkAuth(context),
    [StoreActions.LOGIN_USER]: (context, payload) =>
      loginUser(context, payload),
    [StoreActions.LOGOUT_USER]: context => logoutUser(context),
    [StoreActions.REGISTER_USER]: (context, payload) =>
      registerUser(context, payload),
    [StoreActions.CHANGE_PASSWORD]: (context, payload) =>
      changePassword(context, payload),
    [StoreActions.ADD_PASSWORD]: (context, payload) =>
      addPassword(context, payload),
    [StoreActions.GET_PASSWORDS]: context => getPasswords(context),
    [StoreActions.DECRYPT_PASSWORD]: (context, payload) =>
      getDecryptedPassword(context, payload),
    [StoreActions.RESPONSE_ERROR]: () => {},
    [StoreActions.RESPONSE_SUCCESS]: () => {}
  }
});

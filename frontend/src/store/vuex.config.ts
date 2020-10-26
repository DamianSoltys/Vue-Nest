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
import { IInitalState } from "./store.interface";

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

  commit("CHANGE_LOGGED", data);

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
  commit("CLEAR_STORE");
  return userService.logoutUser();
}

function checkAuth({
  commit
}: ActionContext<IInitalState, IInitalState>): boolean {
  commit("CHANGE_LOGGED", {
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

  commit("SET_PASSWORDS", data);

  return data;
}

//TODO: implement
async function getDecryptedPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: string
): Promise<boolean> {
  return true;
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
    SET_PASSWORDS(state: IInitalState, payload: IPasswordsList[]) {
      state.passwords = payload;
    },
    CHANGE_LOGGED(state: IInitalState, payload: ILoginResponse) {
      state.username = payload?.username || "User";
      state.logged = !!payload?.accessToken || false;
      state.userId = payload?.userId || null;
    },
    CLEAR_STORE(state: IInitalState) {
      state.logged = initialState.logged;
      state.username = initialState.username;
      state.userId = initialState.userId;
    }
  },
  actions: {
    CHECK_AUTH(context) {
      return checkAuth(context);
    },
    LOGIN_USER(context, payload) {
      return loginUser(context, payload);
    },
    LOGOUT_USER(context) {
      return logoutUser(context);
    },
    REGISTER_USER(context, payload) {
      return registerUser(context, payload);
    },
    CHANGE_PASSWORD(context, payload) {
      return changePassword(context, payload);
    },
    ADD_PASSWORD(context, payload) {
      return addPassword(context, payload);
    },
    GET_PASSWORDS(context) {
      return getPasswords(context);
    },
    DECRYPT_PASSWORD(context, payload) {
      return getDecryptedPassword(context, payload);
    }
  }
});

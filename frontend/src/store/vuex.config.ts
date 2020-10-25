import {
  IChangePasswordData,
  IPasswordData
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
  count: 1
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
  return await userService.getTest();
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
    accessToken: userService.getToken()
  });

  return !!userService.getToken();
}

//TODO: implement
async function addPassword(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: IPasswordData
): Promise<boolean> {
  return passwordService.addPassword(payload);
}

//TODO: implement
async function getPasswords(
  { commit, state }: ActionContext<IInitalState, IInitalState>,
  payload: string
): Promise<IPasswordData[]> {
  return passwordService.getPasswords(payload);
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
  return userService.changePassword(payload);
}

export default createStore({
  state(): IInitalState {
    return { ...initialState };
  },
  mutations: {
    CHANGE_LOGGED(state: IInitalState, payload: ILoginResponse) {
      state.username = payload?.username || "User";
      state.logged = !!payload?.accessToken || false;
    },
    CLEAR_STORE(state: IInitalState) {
      state.logged = initialState.logged;
      state.username = initialState.username;
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
    GET_PASSWORDS(context, payload) {
      return getPasswords(context, payload);
    },
    DECRYPT_PASSWORD(context, payload) {
      return getDecryptedPassword(context, payload);
    }
  }
});

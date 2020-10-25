import {
  ILoginData,
  ILoginResponse,
  IRegisterData
} from "@/interfaces/User.interface";
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

export default createStore({
  state(): IInitalState {
    return { ...initialState };
  },
  mutations: {
    CHANGE_LOGGED(state: IInitalState, payload: ILoginResponse) {
      state.username = payload?.username || "User";
      state.logged = !!payload?.access_token || false;
    },
    CLEAR_STORE(state: IInitalState) {
      state.logged = initialState.logged;
      state.username = initialState.username;
    }
  },
  actions: {
    LOGIN_USER(context, payload) {
      return loginUser(context, payload);
    },
    LOGOUT_USER(context) {
      return logoutUser(context);
    },
    REGISTER_USER(context, payload) {
      return registerUser(context, payload);
    }
  }
});

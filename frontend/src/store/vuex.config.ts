import { ILoginData, IRegisterData } from '@/interfaces/User.interface';
import { userService } from '@/services/user.service';
import { Action, ActionContext, createStore, Store } from "vuex";
import { IInitalState } from "./store.interface";

async function loginUser({ commit, state }:ActionContext<IInitalState, IInitalState>,payload:ILoginData):Promise<boolean> {
  return await userService.loginUser(payload);
}

async function registerUser({ commit, state }:ActionContext<IInitalState, IInitalState>,payload:IRegisterData):Promise<boolean> {
  return await userService.registerUser(payload);
}

export default createStore({
  state(): IInitalState {
    return {
      logged: false,
      count: 1
    };
  },
  mutations: {
    INCREMENT(state: IInitalState, payload: number) {
      state.count = payload;
    },
    CHANGE_LOGGED(state: IInitalState, payload: boolean) {
      state.logged = payload;
    }
  },
  actions: {
    LOGIN_USER(context,payload) {
     return loginUser(context,payload);
    },
    REGISTER_USER(context,payload) {
      return registerUser(context,payload);
     }
  }
});

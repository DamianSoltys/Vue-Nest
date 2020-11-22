import { IPasswordsList } from "@/interfaces/password.interface";
import { ILoginResponse } from "@/interfaces/user.interface";

import { createStore } from "vuex";
import {
  checkAuth,
  loginUser,
  logoutUser,
  initialState,
  registerUser,
  changePassword,
  addPassword,
  getPasswords,
  unblockAccount,
  getDecryptedPassword
} from "./store.functions";
import { IInitalState, StoreMutations, StoreActions } from "./store.interface";

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
      state.lastFailureLogin = payload?.lastFailureLogin || null;
      state.lastSuccessLogin = payload?.lastSuccessLogin || null;
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
    [StoreActions.UNBLOCK_ACCOUNT]: context => unblockAccount(context),
    [StoreActions.DECRYPT_PASSWORD]: (context, payload) =>
      getDecryptedPassword(context, payload),
    [StoreActions.RESPONSE_ERROR]: () => {},
    [StoreActions.RESPONSE_SUCCESS]: () => {},
    [StoreActions.TOGGLE_UNBLOCK_BUTTON]: () => {}
  }
});

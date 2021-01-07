import { IDataChange, IHistoryLog } from "@/interfaces/history.interface";
import { IPasswordData, IPasswordsList } from "@/interfaces/password.interface";
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
  getDecryptedPassword,
  toggleSiteMode,
  setModifyPassword,
  updatePassword,
  deletePasword,
  sharePassword,
  getHistory,
  getDataChanges
} from "./store.functions";
import {
  IInitalState,
  StoreMutations,
  StoreActions,
  SiteModeEnum
} from "./store.interface";

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
    [StoreMutations.SET_HISTORY]: (
      state: IInitalState,
      payload: IHistoryLog[]
    ) => {
      state.history = payload;
    },
    [StoreMutations.SET_CHANGES]: (
      state: IInitalState,
      payload: IDataChange[]
    ) => {
      state.dataChanges = payload;
    },
    [StoreMutations.SET_MODIFY_PASSWORD]: (
      state: IInitalState,
      payload: IPasswordData
    ) => {
      state.editData = payload;
    },
    [StoreMutations.TOGGLE_SITE_MODE]: (
      state: IInitalState,
      payload: SiteModeEnum
    ) => {
      state.mode = payload;
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
    [StoreActions.GET_HISTORY]: context => getHistory(context),
    [StoreActions.GET_CHANGES]: (context, payload) =>
      getDataChanges(context, payload),
    [StoreActions.UNBLOCK_ACCOUNT]: context => unblockAccount(context),
    [StoreActions.DECRYPT_PASSWORD]: (context, payload) =>
      getDecryptedPassword(context, payload),
    [StoreActions.TOGGLE_SITE_MODE]: (context, payload) =>
      toggleSiteMode(context, payload),
    [StoreActions.SET_MODIFY_PASSWORD]: (context, payload) =>
      setModifyPassword(context, payload),
    [StoreActions.MODIFY_PASSWORD]: (context, payload) =>
      updatePassword(context, payload),
    [StoreActions.DELETE_PASSWORD]: (context, payload) =>
      deletePasword(context, payload),
    [StoreActions.SHARE_PASSWORD]: (context, payload) =>
      sharePassword(context, payload),
    [StoreActions.RESPONSE_ERROR]: () => {},
    [StoreActions.RESPONSE_SUCCESS]: () => {},
    [StoreActions.TOGGLE_UNBLOCK_BUTTON]: () => {}
  }
});

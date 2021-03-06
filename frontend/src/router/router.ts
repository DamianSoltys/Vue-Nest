import { createWebHistory, createRouter } from "vue-router";
import GuestPageComponent from "../pages/guestPage/guestPage.vue";
import HomePageComponent from "../pages/homePage/homePage.vue";
import PasswordPageComponent from "../pages/passwordPage/passwordPage.vue";
import UserPageComponent from "../pages/userPage/userPage.vue";
import AddPasswordComponent from "../components/passwordForm/passwordForm.vue";
import PasswordListComponent from "../components/passwordList/passwordList.vue";
import HistoryListComponent from "../components/historyList/historyList.vue";
import RegisterFormComponent from "../components/registerForm/registerForm.vue";
import LoginFormComponent from "../components/loginForm/loginForm.vue";
import ChangePasswordFormComponent from "../components/changePasswordForm/changePasswordForm.vue";
import AppLayout from "../App.vue";
import store from "../store/vuex.config";
import {
  IInitalState,
  SiteModeEnum,
  StoreActions
} from "@/store/store.interface";
import { computed, reactive } from "vue";
import { toggleSiteMode } from "@/store/store.functions";

const routes = [
  {
    path: "/",
    name: "AppLayout",
    redirect: "/guest"
  },
  {
    path: "/guest",
    name: "GuestPage",
    redirect: "/guest/login",
    component: GuestPageComponent,
    children: [
      {
        path: "login",
        name: "LoginComponent",
        component: LoginFormComponent
      },
      {
        path: "register",
        name: "RegisterComponent",
        component: RegisterFormComponent
      }
    ]
  },
  {
    path: "/home",
    name: "HomePage",
    component: HomePageComponent
  },
  {
    path: "/history",
    name: "HistoryList",
    component: HistoryListComponent
  },
  {
    path: "/password",
    name: "PasswordPage",
    component: PasswordPageComponent,
    children: [
      {
        path: "new-password",
        name: "AddPasswordForm",
        component: AddPasswordComponent
      },
      {
        path: "password-list",
        name: "PasswordList",
        component: PasswordListComponent
      }
    ]
  },
  {
    path: "/user",
    name: "UserPage",
    component: UserPageComponent,
    children: [
      {
        path: "change-password",
        name: "ChangePasswordForm",
        component: ChangePasswordFormComponent
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.fullPath.includes("guest") && !store.state.logged)
    next({ name: "GuestPage" });

  if (to.fullPath.includes("guest") && store.state.logged)
    next({ name: "HomePage" });

  if (
    (to.fullPath.includes("new-password") ||
      to.fullPath.includes("change-password")) &&
    store.state.mode === SiteModeEnum.READONLY
  )
    next({ name: "HomePage" });

  if (!to.fullPath.includes("new-password") && store.state.editData) {
    store.dispatch(StoreActions.SET_MODIFY_PASSWORD, null);
    next({ name: to.name as string });
  }

  next();
});

export default router;

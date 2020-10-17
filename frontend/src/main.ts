import { createApp } from "vue";
import App from "./App.vue";
import router from './router/router';
import vuexConfig from './store/vuex.config';

createApp(App).use(router).use(vuexConfig).mount("#app");

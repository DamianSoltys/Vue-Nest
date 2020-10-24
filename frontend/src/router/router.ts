import { createWebHistory, createRouter } from "vue-router";
import HomePageComponent from "../pages/HomePage/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePageComponent,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
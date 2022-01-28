import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import UserStore from "@/store/userStore.js";

const authenticationGuard = (to, from, next) => {
  UserStore.actions.checkLogin().then((res) => {
    if (res) {
      return next();
    } else {
      next("/login");
    }
  });
};

const noAauthenticationGuard = (to, from, next) => {
  UserStore.actions.checkLogin().then((res) => {
    if (!res) {
      return next("/login");
    } else {
      next("/");
    }
  });
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: authenticationGuard,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

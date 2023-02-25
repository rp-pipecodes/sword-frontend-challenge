import { useAuthStore } from "./../stores/auth";
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DiscoveryView from "../views/DiscoveryView.vue";

const requireAuth = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.user) {
    next({ name: "login" });
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "discovery",
      component: DiscoveryView,
      beforeEnter: requireAuth,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignupView.vue"),
    },
  ],
});

export default router;

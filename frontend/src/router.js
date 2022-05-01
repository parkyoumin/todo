import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./components/MyGround.vue"),
  },

  {
    path: "/todo",
    name: "Todo",
    component: () => import("./components/MyTodo.vue"),
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
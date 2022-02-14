import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Trivia from "../views/Trivia.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/trivia/:id",
    name: "Trivia",
    component: Trivia,
  },
];

const router = createRouter({
  history: createWebHistory(),
  hash: false,
  routes,
});

export default router;

import { createWebHashHistory, createRouter } from "vue-router";
import { All, Guess, Home } from "./components/pages";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/all", name: "all", component: All },
  { path: "/unlimited", name: "unlimited", component: Guess },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

import { createWebHashHistory, createRouter } from "vue-router";
import { All, Home } from "./components/pages";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/all", name: "all", component: All },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

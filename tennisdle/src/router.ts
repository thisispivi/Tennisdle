import { createMemoryHistory, createRouter } from "vue-router";
import { Home } from "./components/pages";

const routes = [{ path: "/", name: "home", component: Home }];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;

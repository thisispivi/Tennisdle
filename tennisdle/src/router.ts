import { createWebHashHistory, createRouter } from "vue-router";
import {
  All,
  Guess,
  GuessDailyAtpLoader,
  GuessDailyWtaLoader,
  GuessUnlimitedAtpLoader,
  GuessUnlimitedWtaLoader,
  Home,
} from "./components/pages";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/all", name: "all", component: All },
    {
      path: "/unlimited",
      children: [
        {
          path: "atp",
          name: "unlimited-atp",
          component: Guess,
          props: { loader: GuessUnlimitedAtpLoader },
        },
        {
          path: "wta",
          name: "unlimited-wta",
          component: Guess,
          props: { loader: GuessUnlimitedWtaLoader },
        },
      ],
    },
    {
      path: "/daily",
      children: [
        {
          path: "atp",
          name: "daily-atp",
          component: Guess,
          props: { loader: GuessDailyAtpLoader },
        },
        {
          path: "wta",
          name: "daily-wta",
          component: Guess,
          props: { loader: GuessDailyWtaLoader },
        },
      ],
    },
  ],
});

export default router;

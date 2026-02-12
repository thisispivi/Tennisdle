import { createRouter,createWebHashHistory } from "vue-router";

import {
  All,
  AllAtpLoader,
  AllWtaLoader,
  Guess,
  GuessDailyAtpLoader,
  GuessDailyWtaLoader,
  GuessUnlimited,
  GuessUnlimitedAtpLoader,
  GuessUnlimitedWtaLoader,
  Home,
} from "./components/pages";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    {
      path: "/all",
      name: "all",
      children: [
        {
          path: "atp",
          name: "all-atp",
          component: All,
          props: { players: AllAtpLoader().players },
        },
        {
          path: "wta",
          name: "all-wta",
          component: All,
          props: { players: AllWtaLoader().players },
        },
      ],
    },
    {
      path: "/unlimited",
      children: [
        {
          path: "atp",
          name: "unlimited-atp",
          component: GuessUnlimited,
          props: { loader: GuessUnlimitedAtpLoader },
        },
        {
          path: "wta",
          name: "unlimited-wta",
          component: GuessUnlimited,
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

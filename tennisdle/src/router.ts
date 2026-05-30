import { createRouter, createWebHashHistory } from "vue-router";

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
import GuessImageAtpLoader from "./components/pages/GuessImage/GuessImageAtp.loader";
import GuessImageWtaLoader from "./components/pages/GuessImage/GuessImageWta.loader";

const GuessImage = () =>
  import("./components/pages/GuessImage/GuessImage.vue");
const GuessVenue = () =>
  import("./components/pages/GuessVenue/GuessVenue.vue");
const Top10 = () => import("./components/pages/Top10/Top10.vue");
const Grid = () => import("./components/pages/Grid/Grid.vue");

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
    {
      path: "/image",
      children: [
        {
          path: "atp",
          name: "image-atp",
          component: GuessImage,
          props: { loader: GuessImageAtpLoader },
        },
        {
          path: "wta",
          name: "image-wta",
          component: GuessImage,
          props: { loader: GuessImageWtaLoader },
        },
      ],
    },
    {
      path: "/venue",
      name: "venue",
      component: GuessVenue,
    },
    {
      path: "/top10",
      name: "top10",
      component: Top10,
    },
    {
      path: "/grid",
      name: "grid",
      component: Grid,
    },
  ],
});

export default router;

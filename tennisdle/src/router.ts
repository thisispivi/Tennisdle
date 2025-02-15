import { createWebHashHistory, createRouter } from "vue-router";
import { All, Guess, Home } from "./components/pages";
import { GuessUnlimitedAtpLoader } from "./components/pages/Guess/GuessUnlimitedAtp.loader";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/all", name: "all", component: All },
    {
      path: "/unlimited",
      children: [
        {
          path: "/atp",
          name: "unlimited-atp",
          component: Guess,
          props: GuessUnlimitedAtpLoader,
        },
      ],
    },
  ],
});

export default router;

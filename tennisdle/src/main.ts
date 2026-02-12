import "./styles/global.scss";
import "./styles/variables.scss";
import "./styles/mixins.scss";
import "./styles/scrollbar.scss";
import "floating-vue/dist/style.css";

import FloatingVue from "floating-vue";
import { createApp } from "vue";

import App from "./App.vue";
import i18n from "./i18n";
import { createRedux } from "./redux/create";
import { store } from "./redux/store";
import router from "./router";

createApp(App)
  .use(router)
  .use(i18n)
  .use(FloatingVue)
  .use(createRedux(store))
  .mount("#app");

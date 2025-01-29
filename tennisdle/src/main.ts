import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/global.scss";
import "./styles/variables.scss";
import "./styles/mixins.scss";
import "./styles/scrollbar.scss";
import "floating-vue/dist/style.css";
import i18n from "./i18n";
import FloatingVue from "floating-vue";

createApp(App).use(router).use(i18n).use(FloatingVue).mount("#app");

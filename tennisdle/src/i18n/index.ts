import { createI18n } from "vue-i18n";
import * as en from "./locales/en/index";
import * as it from "./locales/it/index";

const i18n = createI18n({
  availableLocales: ["en", "it"],
  fallbackLocale: "en",
  inheritLocale: true,
  globalInjection: true,
  messages: {
    en: en.default.common,
    it: it.default.common,
  },
});

export default i18n;

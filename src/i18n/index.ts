import { createI18n } from "vue-i18n";
import en from "./locales/en.json";

type MessageSchema = typeof en;

export default createI18n<[MessageSchema], "en">({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  messages: {
    en: en,
  },
});

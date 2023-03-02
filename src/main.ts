import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./services/firebaseConfig";
import "vue-toast-notification/dist/theme-default.css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import i18n from "./i18n";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(i18n);

app.mount("#app");

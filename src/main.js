import { createApp } from "vue";
import router from "./router/index.js";
import "./assets/scss/app.scss";
import App from "./App.vue";

import "bootstrap/scss/bootstrap.scss";
import "bootstrap/dist/js/bootstrap.js";
createApp(App).use(router).mount("#app");

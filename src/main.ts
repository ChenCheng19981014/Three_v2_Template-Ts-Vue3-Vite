import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import "./assets/css/reset.less";

createApp(App).use(router).mount("#app");

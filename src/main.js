import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";

const app = createApp(App);

// router
import router from "./router";

// pinia
import { createPinia } from "pinia";

const pinia = createPinia();

app.use(router).use(pinia).mount("#app");

import { createApp } from "vue";
import router from "@/routes/";
import App from "@/App.vue";
import InterceptorService from "@/services/InterceptorService";
import "./scss/reset.scss";


InterceptorService();
createApp(App).use(router).mount("#app");

import { createApp } from "vue";
import router from "@/routes/";
import App from "@/App.vue";
import axios from "axios";
import "./scss/reset.scss";

if (import.meta.env.PROD) {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL_PROD + import.meta.env.VITE_API_VERSION
} else {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL + import.meta.env.VITE_API_VERSION ||
    "https://localhost:3000/v1";
}
axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

createApp(App).use(router).mount("#app");

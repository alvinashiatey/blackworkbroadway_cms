import { createApp } from "vue";
import router from "@/routes/";
import App from "@/App.vue";
import axios from "axios";
import "./scss/reset.scss";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL + import.meta.env.VITE_API_VERSION ||
  "https://localhost:3000/v1";
console.log(import.meta.env.API_URL);
axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

createApp(App).use(router).mount("#app");

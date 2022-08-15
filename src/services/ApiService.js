import axios from "axios";
let baseURL;
if (import.meta.env.PROD) {
    baseURL =
        import.meta.env.VITE_API_URL_PROD + import.meta.env.VITE_API_VERSION
} else {
    baseURL =
        import.meta.env.VITE_API_URL + import.meta.env.VITE_API_VERSION ||
        "https://localhost:3000/v1";
}

const instance = axios.create({
    baseURL, headers: {
        "Content-Type": "application/json",
    },
})

export default instance;
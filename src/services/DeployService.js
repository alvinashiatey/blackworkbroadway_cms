import api from "./ApiService";
const env = process.env.NODE_ENV || "development";

class DeployService {
        async deploy() {
                if(env === "development") return console.log("deployed")
                let res = await api.get("/deploy");
                return res.data;
        }
}

export default new DeployService();
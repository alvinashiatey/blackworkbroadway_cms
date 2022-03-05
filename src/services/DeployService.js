import axios from "axios";

class DeployService {
        async deploy() {
                let res = await axios.get("/deploy");
                return res.data;
        }
}

export default new DeployService();
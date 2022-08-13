import axios from "axios";

class EditService {
        async getAbout(name = "about") {
                let res = await axios.get("/edit/" + name);
                return res.data;
        }
        async updateAbout(data) {
                let res = await axios.put("/edit/about", data);
                return res.data;
        }
}

export default new EditService();
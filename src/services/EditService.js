import api from "./ApiService";

class EditService {
        async getAbout(name = "about") {
                let res = await api.get("/edit/" + name);
                return res.data;
        }
        async updateAbout(data) {
                let res = await api.put("/edit/about", data);
                return res.data;
        }
}

export default new EditService();
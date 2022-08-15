import api from "./ApiService";

class PlayService {
  async getPlays() {
    let res = await api.get("/plays");
    return res.data;
  }
  async getPlay(id) {
    let res = await api.get(`/plays/${id}`);
    return res.data;
  }
  async createPlay(play) {
    let res = await api.post("/plays", play);
    console.log(res)
    return res.data;
  }
  async updatePlay(id, play) {
    let res = await api.put(`/plays/${id}`, play);
    return res.data;
  }
  async deletePlay(id) {
    let res = await api.delete(`/plays/${id}`);
    return res.data;
  }
}

export default new PlayService();

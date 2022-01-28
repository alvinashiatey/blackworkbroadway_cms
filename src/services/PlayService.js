import axios from "axios";

class PlayService {
  async getPlays() {
    let res = await axios.get("/plays");
    return res.data;
  }
  async getPlay(id) {
    let res = await axios.get(`/plays/${id}`);
    return res.data;
  }
  async createPlay(play) {
    let res = await axios.post("/plays", play);
    return res.data;
  }
  async updatePlay(id, play) {
    let res = await axios.put(`/plays/${id}`, play);
    return res.data;
  }
  async deletePlay(id) {
    let res = await axios.delete(`/plays/${id}`);
    return res.data;
  }
}

export default new PlayService();

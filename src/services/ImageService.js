import api from "./ApiService";

class ImageService {
  async getImages() {
    let res = await api.get("/images");
    return res.data;
  }

  async getImage(id) {
    let res = await api.get(`/images/${id}`);
    return res.data;
  }

  async createImage(image) {
    let res = await api.post("/images", image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async updateImage(id, image) {
    let res = await api.put(`/images/${id}`, image);
    return res.data;
  }

  async deleteImage(id) {
    let res = await api.delete(`/images/${id}`);
    return res.data;
  }
}

export default new ImageService();

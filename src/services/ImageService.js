import axios from "axios";

class ImageService {
  async getImages() {
    let res = await axios.get("/images");
    return res.data;
  }

  async getImage(id) {
    let res = await axios.get(`/images/${id}`);
    return res.data;
  }

  async createImage(image) {
    let res = await axios.post("/images", image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async updateImage(id, image) {
    let res = await axios.put(`/images/${id}`, image);
    return res.data;
  }

  async deleteImage(id) {
    let res = await axios.delete(`/images/${id}`);
    return res.data;
  }
}

export default new ImageService();

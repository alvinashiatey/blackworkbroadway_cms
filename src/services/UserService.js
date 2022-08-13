import axios from "axios";

class UserService {
  async login(data) {
    try {
      const response = await axios.post("/login", data);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        return response.data.user;
      } else {
        console.log(response.message);
        return False;
      }
    } catch (e) {
      console.log(e.message);
      return False;
    }
  }
  logout() {
    localStorage.clear();
  }
  async isLoggedIn() {
    let isLoggedIn = localStorage.getItem("token");
    if (isLoggedIn) {
      try {
        axios.defaults.headers.common["Authorization"] = `${isLoggedIn}`;
        const response = await axios.get(
          `/users/${localStorage.getItem("user")}`
        );
        if (response.data.status === "success") {
          return true;
        } else {
          localStorage.clear();
          return false;
        }
      } catch (e) {
        console.log(e.message);
      }
    } else {
      this.logout();
      return false;
    }
  }
}

export default new UserService();

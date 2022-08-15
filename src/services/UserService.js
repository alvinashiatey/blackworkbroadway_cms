import api from "./ApiService";
import TokenService from "@/services/TokenService";

class UserService {
    async login(data) {
        try {
            const response = await api.post("/login", data);
            if (response.data.success) {
                TokenService.setUser(response.data)
                return response.data.user;
            } else {
                console.log(response.message);
                return false;
            }
        } catch (e) {
            console.error(e.message);
            return false;
        }
    }

    logout() {
        TokenService.removeUser()
    }

    async isLoggedIn() {
        let isLoggedIn = TokenService.getLocalAccessToken();
        if (isLoggedIn) {
            try {
                const response = await api.get(
                    `/users/${TokenService.getUser().id}`
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

    async getUsers() {
        try {
            const response = api.get("/users")
            return (await response).data.data
        } catch (error) {
            console.error(error.message)
        }
    }

    async createUser(data) {
        try {
            const res = api.post("/users", data)
            return res.data
        } catch (e) {
            console.log(e.message)
        }
    }

    async deleteUser(id) {
        try {
            const res = await api.delete(`/users/${id}`);
            return res.data
        } catch (e){
            console.log(e.message)
        }
    }
}

export default new UserService();

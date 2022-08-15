import {reactive, readonly} from "vue";
import UserService from "../services/UserService";

const state = reactive({
    user: null,
    users: null
});

const methods = {
    setUser(user) {
        return (state.user = user);
    },
    setUsers(users) {
        return (state.users = users)
    },
    appendUser(user) {
        state.users.push(user);
        return state.users
    },
    deleteUser(data) {
        (state.users = state.users?.filter((p) => p.uuid !== data.uuid));
        return state.users;
    },
};

const actions = {
    async login(data) {
        const response = await UserService.login(data);
        return methods.setUser(response);
    },
    async logout() {
        UserService.logout();
        return methods.setUser(null);
    },
    async checkLogin() {
        return UserService.isLoggedIn();
    },
    async fetchAllUsers() {
        try {
            const response = await UserService.getUsers();
            methods.setUsers(response)
        } catch (e) {
            console.log(e.message)
        }
    },
    async createUser(user) {
        try {
            const response = await UserService.createUser(user)
            methods.appendUser(response)
        } catch (e) {
            console.log(e.message)
        }
    },
    async deleteUser(user) {
        try {
            await UserService.deleteUser(user.uuid)
            methods.deleteUser(user)
        } catch (e) {
            console.log(e.message)
        }
    }
};

const getters = {
    user() {
        return state.user;
    },
    users() {
        return state.users
    }
};

export default {
    state: readonly(state),
    actions,
    getters,
};

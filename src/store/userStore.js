import { reactive, readonly } from "vue";
import UserService from "../services/UserService";

const state = reactive({
  user: null,
});

const methods = {
  setUser(user) {
    return (state.user = user);
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
};

const getters = {
  user() {
    return state.user;
  },
};

export default {
  state: readonly(state),
  actions,
  methods,
  getters,
};

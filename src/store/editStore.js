import EditService from "@/services/EditService";
import { reactive, readonly } from "vue";

const state = reactive({
        about: "",
});

const methods = {
        setData(data, name) {
                state[name] = data;
                return state[name];
        }
}

const actions = {
        async fetchData() {
                EditService.getAbout().then((res) => {
                        methods.setData(res.about.rendered, "about");
                });
        },
        async updateData(data) {
                EditService.updateAbout(data).then((res) => {
                        methods.setData(data.content, "about");
                });
        }
}

const getters = {
        about: () => {
                if (state.about !== "") {
                        return state.about;
                }
        },
}

export default {
        state: readonly(state),
        actions,
        methods,
        getters,
};

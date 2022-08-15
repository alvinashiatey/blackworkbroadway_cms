<template>
  <div class="wrapper">
    <NavBarVue :store="data.navStore"/>
    <div class="users">
      <UserModalFormVue v-if="data.modalStore.showModal" :data="data.modalStore"/>
      <div class="container">
        <table>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
          <UserVue v-for="user in userStore.state.users" :user="user" :key="user?.uuid" :data="data.userStore"></UserVue>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import UserModalFormVue from "@/components/UserModalForm.vue";
import NavBarVue from "@/components/NavBar.vue"
import UserVue from "@/components/User.vue";
import userStore from "@/store/userStore.js";
import EventBus from "@/Common/EventBus";
import {reactive} from 'vue';


export default {
  name: "Users.vue",
  components: {
    UserModalFormVue,
    NavBarVue,
    UserVue
  },
  setup() {
    userStore.actions.fetchAllUsers()
    const data = reactive({
      modalStore: {
        showModal: false,
        user: userStore.state.user
      },
      userStore: {},
      navStore: {
        aboutModal: false,
        total: () => 20,
        showSort: false,
        editAbout: {
          edit: false,
        },
        showAdd: false,
        alertData: {
          show: false,
          message: "",
        },
      }
    })

    data.modalStore.cancel = () => {
      data.modalStore.showModal = false;
    }

    data.modalStore.createUser = async (d) => {
      try {
        await userStore.actions.createUser(d)
      } catch (e) {
      console.log(e.message)
      }
    }

    data.navStore.handleLogout = () => {
      EventBus.dispatch("logout");
    }

    data.navStore.handleAddUser = () => {
      data.modalStore.showModal = !data.modalStore.showModal;
    }

    data.modalStore.hideModal = ()=> {
      data.modalStore.showModal = false
    }

    data.userStore.handleDeleteUser = async (user)=>{
      await userStore.actions.deleteUser(user)
    }

    return {
      data,
      userStore,
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .users {
    position: relative;
    width: 100vw;
    height: 100%;
    overflow-y: scroll;
    padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
    box-sizing: content-box; /* So the width will be 100% + 17px */
  }

  .container {
    padding-inline: 0.5rem;

    table {
      width: 100%;
      border-spacing: 0; /* Removes the cell spacing via CSS */
      border-collapse: collapse; /* Optional - if you don't want to have double border where cells touch */
      tr {
        &:first-child {
        }

        th {
          margin: 0;
          padding: 0;
          text-align: left;
          border-bottom: solid 1px var(--secondary-color);
        }
      }
    }
  }
}
</style>
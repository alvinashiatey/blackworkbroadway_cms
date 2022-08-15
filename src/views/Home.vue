<template>
  <div class="wrapper">
    <AlertBoxVue :content="data.navStore.alertData"/>
    <NavBarVue :store="data.navStore" ref="navbar"/>
    <div :class="data.classObject">
      <AboutModalVue v-if="data.navStore.aboutModal" :data="data.navStore"/>
      <ModalFormVue v-if="data.showModal" :data="data.editData"/>
      <ModalUploadVue v-if="data.showUpload" :data="data.uploadData"/>
      <div class="home__container">
        <div class="plays">
          <PlayVue
              v-for="play in playStore.state.filtered"
              :play="play"
              :key="play.uuid"
              @edit="handleEdit"
              @upload="handleUpload"
              @delete="handleDelete"
          />
        </div>
        <ImageCapsuleVue
            :images="data.imageData.images"
            v-if="data.imageData.show"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AboutModalVue from "@/components/AboutModal.vue"
import ModalFormVue from "@/components/PlayModalForm.vue";
import ModalUploadVue from "@/components/ModalUpload.vue";
import ImageCapsuleVue from "@/components/ImageCapsule.vue";
import NavBarVue from "@/components/NavBar.vue"
import PlayVue from "@/components/Play.vue";
import AlertBoxVue from "@/components/AlertBox.vue";
import playStore from "@/store/playStore.js";
import userStore from "@/store/userStore.js";
import {provide, reactive, ref, watch} from 'vue';
import EventBus from "@/Common/EventBus";

export default {
  components: {
    PlayVue,
    AlertBoxVue,
    NavBarVue,
    AboutModalVue,
    ModalFormVue,
    ModalUploadVue,
    ImageCapsuleVue,
  },

  setup() {
    playStore.actions.fetchPlays();
    const navbar = ref(null);
    let data = reactive({
      showModal: false,
      showUpload: false,
      showSort: true,
      aboutModal: false,
      uploadData: {
        uuid: '',
        images: [],
      },
      editData: {
        item: {},
      },
      classObject: {
        "home": true,
        "noFlow": false
      },
      navStore: {
        aboutModal: false,
        total: playStore.getters.total,
        showSort: true,
        editAbout: {
          edit: false,
        },
        showAdd: false,
        alertData:{
          show: false,
          message: "",
        },
      },
      imageData: {
        images: [],
        show: false,
      }
    });

    data.editAbout = {
      edit: false,
    }

    watch(() => [data.navStore.alertData.show, data.navStore.alertData.message],
        ([show, message]) => {
      localStorage.showAlert = show
      localStorage.alert = message
    })

    const save = () => {
      data.classObject.noFlow = false
      data.navStore.alertData.message = "Don't forget to deploy to live site."
      data.navStore.alertData.show = true;
      data.navStore.showSort = true;
      data.navStore.showAdd = false;
    }

    data.uploadData.save = () => {
      data.showUpload = false;
      save()
    }

    data.editData.save = () => {
      data.showModal = false;
      save()
    }

    const handleDelete = ()=>{
      console.log("delete")
      save()
    }

    const handleDeploy = async () => {
      await playStore.actions.deploy()
    }

    const handleSortBy = (sortBy)=>{
      return playStore.actions.sortPlay(sortBy)
    }

    const handleSearch = (entry) =>{
      return playStore.actions.searchPlay(entry)
    }

    const cancel = () => {
      data.showModal = false;
      data.showUpload = false;
      data.classObject.noFlow = false
      data.navStore.showSort = true;
      data.navStore.aboutModal = false;
      data.navStore.editAbout.edit = false;
      data.navStore.showAdd = false;
    }

    const handleEdit = (d) => {
      data.showModal = true;
      data.editData.item = d;
      document.querySelector(".home").scrollTop = 0;
      data.classObject.noFlow = true;
      data.navStore.showSort = false;
      data.navStore.aboutModal = false;
    }

    const handleAddButton = () => {
      data.editData.item = {};
      data.showModal = !data.showModal;
      data.showUpload = false;
      data.navStore.showAdd = true;
      data.navStore.showSort = data.navStore.aboutModal ? (data.navStore.showSort = false) : !data.navStore.showSort;
      data.navStore.aboutModal = false;
      if (data.showModal) {
        document.querySelector(".home").scrollTop = 0;
        data.classObject.noFlow = true
      } else {
        data.classObject.noFlow = false
      }
    }

    const handleLogout = () => {
      userStore.actions.logout();
      EventBus.dispatch("logout");
    }

    const handleAboutButton = () => {
      data.navStore.aboutModal = !data.navStore.aboutModal;
      data.navStore.showSort = data.showModal ? (data.navStore.showSort = false) : !data.navStore.showSort;
      data.showModal = false;
      data.showUpload = false;
      data.classObject.noFlow = false;
      if (data.navStore.aboutModal) {
        document.querySelector(".home").scrollTop = 0;
        data.classObject.noFlow = true
      } else {
        data.classObject.noFlow = false
      }
    }

    const handleEditAbout = () => {
      data.navStore.editAbout.edit = !data.navStore.editAbout.edit;
    }

    const handleUpload = (uuid, images) => {
      data.showUpload = !data.showUpload;
      data.uploadData.uuid = uuid;
      data.uploadData.images = images;
      data.navStore.showSort = false;
      data.navStore.aboutModal = false;
      if (data.showUpload) {
        document.querySelector(".home").scrollTop = 0;
        data.classObject.noFlow = true
      } else {
        data.classObject.noFlow = false
        save()
      }
    }

    const handleUsersButton = ()=>{
      EventBus.dispatch("users");
    }


    data.editData.cancel = cancel
    data.navStore.cancel = cancel;
    data.uploadData.cancel = cancel;
    data.navStore.handleLogout = handleLogout;
    data.navStore.handleAddbutton = handleAddButton;
    data.navStore.handleEditAbout = handleEditAbout;
    data.navStore.handleAboutButton = handleAboutButton;
    data.navStore.handleUsersButton=  handleUsersButton
    data.navStore.handleSortBy = handleSortBy;
    data.navStore.handleSearch = handleSearch;
    data.navStore.handleDeploy = handleDeploy;

    provide('playStore', playStore);
    provide('imageData', data.imageData);
    provide('navbar', navbar);
    return {
      data,
      navbar,
      playStore,
      handleEdit,
      handleUpload,
      handleDelete
    };
  }
};

</script>


<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.home {
  background-color: var(--primary-color);
  width: 100vw;
  height: 100%;
  overflow-x:hidden ;
  overflow-y: scroll;
  padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
  box-sizing: content-box; /* So the width will be 100% + 17px */
  position: relative;

  &.noFlow {
    overflow: hidden;
  }

  .home__container {
    width: 100vw;
  }
}
</style>
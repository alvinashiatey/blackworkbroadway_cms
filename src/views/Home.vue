<template>
        <div class="wrapper">
                <NavBarVue
                        @addField="handleAddbutton"
                        @logout="handleLogout"
                        :total="playStore.getters.total()"
                />
                <div :class="data.classObject">
                        <ModalFormVue v-if="data.showModal" :data="data.editData" />
                        <ModalUploadVue v-if="data.showUpload" :data="data.uploadData" />
                        <div class="home__container">
                                <div class="plays">
                                        <PlayVue
                                                v-for="play in playStore.state.filtered"
                                                :play="play"
                                                :key="play.uuid"
                                                @edit="handleEdit"
                                                @upload="handleUpload"
                                        />
                                </div>
                                <ImageCapsuleVue :images="imageData.images" v-if="imageData.show" />
                        </div>
                </div>
        </div>
</template>

<script>
import ModalFormVue from "@/components/ModalForm.vue";
import ModalUploadVue from "@/components/ModalUpload.vue";
import ImageCapsuleVue from "@/components/ImageCapsule.vue";
import NavBarVue from "@/components/NavBar.vue"
import PlayVue from "@/components/Play.vue";
import playStore from "@/store/playStore.js";
import userStore from "@/store/userStore.js";
import { provide, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
        components: {
                PlayVue,
                NavBarVue,
                ModalFormVue,
                ModalUploadVue,
                ImageCapsuleVue,
        },
        setup() {
                playStore.actions.fetchPlays();
                const router = useRouter();
                let data = reactive({
                        showModal: false,
                        showUpload: false,
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
                });

                let imageData = reactive({
                        images: [],
                        show: false,

                });

                data.editData.cancel = () => {
                        data.showModal = false;
                        data.classObject.noFlow = false
                }

                data.uploadData.cancel = () => {
                        data.showUpload = false;
                        data.classObject.noFlow = false
                }

                data.uploadData.save = () => {
                        data.showUpload = false;
                        data.classObject.noFlow = false
                }

                data.editData.save = () => {
                        data.showModal = false;
                        data.classObject.noFlow = false
                }

                const handleEdit = (d) => {
                        data.showModal = true;
                        data.editData.item = d;
                        document.querySelector(".home").scrollTop = 0;
                        data.classObject.noFlow = true;
                }

                const handleAddbutton = () => {
                        data.editData.item = {};
                        data.showModal = !data.showModal;
                        data.showUpload = false;
                        if (data.showModal) {
                                document.querySelector(".home").scrollTop = 0;
                                data.classObject.noFlow = true
                        } else {
                                data.classObject.noFlow = false
                        }
                }

                const handleLogout = () => {
                        userStore.actions.logout();
                        router.push({ name: "Login" });
                }

                const handleUpload = (uuid, images) => {
                        data.showUpload = !data.showUpload;
                        data.uploadData.uuid = uuid;
                        data.uploadData.images = images;
                        if (data.showUpload) {
                                document.querySelector(".home").scrollTop = 0;
                                data.classObject.noFlow = true
                        } else {
                                data.classObject.noFlow = false
                        }
                }

                provide('playStore', playStore);
                provide('imageData', imageData);
                return {
                        data,
                        playStore,
                        imageData,
                        handleEdit,
                        handleLogout,
                        handleUpload,
                        handleAddbutton,
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
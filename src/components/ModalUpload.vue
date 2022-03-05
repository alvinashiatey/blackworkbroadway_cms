<template>
  <div class="upload">
    <div class="upload__container">
      <div class="upload__wrapper">
        <div
          @dragenter.prevent="toggleActive"
          @dragleave.prevent="toggleActive"
          @dragover.prevent
          @drop.prevent="handleDragDrop"
          :class="{ 'active-dropzone': active, 'notactive': imagePreview }"
          class="images"
        >
          <div class="image" v-for="(image, index) in data.images" :key="image.uuid">
            <div class="image__wrapper" ref="imageRef" :data-key="index">
              <div class="delete__button">
                <p @click="handleDeleteImage(image.uuid)">✖︎</p>
              </div>
              <img :src="apiURL + image.path" :alt="image.alttext" />
              <div class="caption">
                <p>Caption:</p>
                <p
                  @input="getImageUUID(image.uuid, index)"
                  contenteditable="true"
                  class="caption__text"
                  :data-key="index"
                >{{ image.caption }}</p>
              </div>
              <div class="alttext">
                <p>Alt-Text:</p>
                <p
                  @input="getImageUUID(image.uuid, index)"
                  contenteditable="true"
                  class="alt__text"
                  :data-key="index"
                >{{ image.alttext }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="imagePreview" class="preview__window">
          <div class="preview__wrapper">
            <div class="preview__image">
              <img :src="imagePreview" alt="preview uploaded image" />
            </div>
            <div class="input__container">
              <div class="form__group alt__text">
                <p>Alt text:</p>
                <input type="text" v-model="data.alttext" />
              </div>
              <div class="form__group caption__text">
                <p>Caption text:</p>
                <input type="text" v-model="data.caption" />
              </div>
            </div>
          </div>
        </div>

        <div class="buttons">
          <div v-if="data.formData" class="submit__btn">
            <button @click="handleSubmit">Submit</button>
          </div>
          <div v-else class="add__btn">
            <input
              @change="handleImageUpload"
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              style="display: none"
              ref="fileInput"
            />
            <button @click="handleUpload">{{ data.buttonText }}</button>
          </div>
          <div class="cancel__btn">
            <button class="form__button cancel" type="button" @click="handleCancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { inject, onMounted } from "@vue/runtime-core";
export default {
  name: "ModalUpload",
  props: ["data"],
  setup(props) {
    const apiURL = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL;
    const playStore = inject("playStore");
    const navbar = inject("navbar");
    const fileInput = ref(null);
    const imagePreview = ref(null);
    const imageUUID = ref(null);
    const imageRef = ref(null);
    const active = ref(false);
    const toggleActive = () => {
      active.value = !active.value;
    };

    let data = reactive({
      images: [],
      buttonText: "Upload Media",
      alttext: "",
      caption: "",
      formData: null,
      play_id: props.data.uuid || null,
    });

    const imageTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];

    const handleImageUpload = () => {
      const file = fileInput.value.files[0];
      if (file && imageTypes.includes(file.type)) {
        data.formData = new FormData();
        data.formData.append("file", file);
        data.formData.append("play_id", data.play_id);
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const handleDragDrop = (e) => {
      toggleActive();
      const file = e.dataTransfer.files[0];
      if (file && imageTypes.includes(file.type)) {
        data.formData = new FormData();
        data.formData.append("file", file);
        data.formData.append("play_id", data.play_id);
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const getImageUUID = (uuid, index) => {
      imageUUID.value = uuid;
      let s = imageRef.value.querySelectorAll(`[data-key="${index}"]`);
      s.forEach((el) => {
        if (el.classList.contains("caption__text")) {
          data.caption = el.innerText;
        } else if (el.classList.contains("alt__text")) {
          data.alttext = el.innerText;
        }
      });
    };

    const handleSubmit = () => {
      if (data.formData) {
        data.formData.append("alttext", data.alttext);
        data.formData.append("caption", data.caption);
        playStore.actions.uploadMedia(data.formData, data.play_id).then(() => {
          if (!navbar.value.data.sortBy) return;
          playStore.actions.sortPlay(navbar.value.data.sortBy);
        });
        props.data.save();
      }
    };

    const uploadMedia = () => {
      fileInput.value.click();
    };

    const updateMedia = async () => {
      try {
        if (!imageUUID.value) return;
        let d = {
          alttext: data.alttext,
          caption: data.caption,
        };
        playStore.actions
          .updateMedia(d, imageUUID.value, data.play_id)
          .then(() => {
            if (!navbar.value.data.sortBy) return;
            playStore.actions.sortPlay(navbar.value.data.sortBy);
          });
      } catch (e) {
        console.log(e.message);
      }
    };

    const handleUpload = () => {
      if (data.buttonText === "Upload Media") {
        uploadMedia();
      } else if (data.buttonText === "Update") {
        updateMedia();
        props.data.save();
      }
    };

    const handleCancel = () => {
      props.data.cancel();
    };

    const handleDeleteImage = (uuid) => {
      confirm("Are you sure you want to delete this image?") &&
        playStore.actions.deleteMedia(uuid, data.play_id).then(() => {
          if (!navbar.value.data.sortBy) return;
          playStore.actions.sortPlay(navbar.value.data.sortBy);
        });
      props.data.cancel();
    };

    onMounted(() => {
      if (props.data.images) {
        data.images = props.data.images;
        if (data.images.length) {
          data.buttonText = "Update";
        }
      }
    });

    return {
      data,
      apiURL,
      active,
      imageRef,
      fileInput,
      imagePreview,
      toggleActive,
      getImageUUID,
      handleCancel,
      handleUpload,
      handleSubmit,
      handleDragDrop,
      handleImageUpload,
      handleDeleteImage,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload {
  z-index: 20;
  color: var(--black-color);
  width: 100%;
  background-color: var(--primary-color);
  margin: 0 auto;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  position: absolute;
  inset: 0;
  overflow-y: scroll;
  &__container {
    margin: 0 auto;
    width: 40rem;
    @media screen and (max-width: 60em) {
      width: 80vw;
    }
  }
  &__wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1em;
    height: auto;
    width: 40rem;
    padding-block-start: 2em;
    @media screen and (max-width: 60em) {
      width: 80vw;
    }

    .images {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1em;
      width: 100%;
      min-height: 40vh;
      height: 100%;
      background-color: var(--primary-color);
      filter: saturate(0.8);
      &.active-dropzone {
        background-color: var(--primary-color);
        border: 1px dashed var(--black-color);
        position: relative;
        &::before {
          content: "Drop Image Here";
          position: absolute;
          inset: 0;
          widows: 100%;
          height: 100%;
          text-align: center;
          line-height: 2em;
        }
      }
      &.notactive {
        min-height: 0 !important;
        height: 100% !important;
        background-color: none;
        filter: none;
      }
      // overflow-y: scroll;
      .image {
        &__wrapper {
          .delete__button {
            text-align: right;
            p {
              cursor: pointer;
              font-size: 1.5rem;
              user-select: none;
              position: absolute;
              display: inline-block;
              padding-inline: 0.4em;
              background-color: var(--secondary-color);
              color: var(--primary-color);
              filter: contrast(6.2);

              &:hover {
                filter: contrast(8.2) drop-shadow(0 1px 1px var(--black-color));
              }
            }
          }
          .caption,
          .alttext {
            margin-block-start: 1.5em;
            text-transform: none;
            .alt__text,
            &__text {
              margin-block-start: 0.25em;
              border-bottom: 1px solid var(--black-color);
            }

            p {
              &:focus {
                outline: none;
              }
            }
          }
        }
      }
    }
    .preview__window {
      width: inherit;
      min-height: 40rem;
      height: auto;
      .preview__wrapper {
        width: inherit;
        .preview__image {
          width: 100%;

          img {
            height: 100%;
          }
        }
        .input__container {
          .form__group {
            margin-block-start: 0.5rem;
            width: 100%;
            input[type="text"] {
              width: 100%;
              padding: 0.5rem;
              border: 0;
              border-bottom: 1px solid #d0cab2;
              font-size: var(--font-size);
              &:focus {
                outline: none;
                border-color: var(--secondary-color);
              }
            }
          }
        }
      }
    }
    .buttons {
      display: flex;
      gap: 0.5em;
      .add__btn,
      .submit__btn {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 0.5rem;
        button {
          border-radius: 0.5em;
          background-color: var(--secondary-color);
          border: 0;
          color: #d0cab2;
          &:hover {
            cursor: pointer;
            filter: brightness(1.2);
          }
          width: 100%;
          padding: 0.5rem;
          border: 0;
          border-bottom: 1px solid #d0cab2;
          font-size: var(--font-size);
          &:focus {
            outline: none;
            border-color: var(--secondary-color);
          }
        }
        span {
          font-size: var(--font-size-xlg);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          color: var(--black-color);
          user-select: none;
          &:hover {
            color: #fff;
          }
        }
      }
      .cancel__btn {
        button {
          background-color: var(--secondary-color);
          border: 0;
          color: #d0cab2;
          padding: 0.5em;
          border-radius: 0.5em;
          filter: contrast(6.2);
          transition: all 0.2s ease-in-out;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

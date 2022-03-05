<template>
  <div class="image__container">
    <div class="images">
      <div v-for="img in images" :key="img.uuid" class="image">
        <img :src="apiURL + img.path" :alt="img.alttext" />
        <p>{{ img.caption }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
export default {
  name: "ImageCapsule",
  props: {
    images: {
      type: Array,
    },
  },
  setup() {
    const apiURL = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL;
    onMounted(() => {
      // transform the postion of the image__conatiner to the mouse position.
      document.body.addEventListener("mousemove", (e) => {
        const imageContainer = document.querySelector(".image__container");
        if (imageContainer == null) return;
        // position the image__container to the center of the mouse.
        imageContainer.style.left = e.clientX + "px";
        imageContainer.style.top = `${e.clientY / 2}px`;
      });
    });
    return {
      apiURL,
    };
  },
};
</script>

<style lang="scss" scoped>
.image__container {
  position: fixed;
  width: 40vmin;
  height: auto;
  bottom: 0;
  right: 0;
  pointer-events: none;
  &:hover {
    background-color: tomato;
  }
  .images {
    background-color: var(--primary-color);
    border-radius: 0.5em;
    padding: 0.5em;
    display: flex;
    justify-content: end;
    width: 100%;
    .image {
      width: inherit;
      height: inherit;
      position: relative;
      img {
        width: 100%;
      }
      p {
        line-height: 120%;
      }
    }
  }
}
</style>

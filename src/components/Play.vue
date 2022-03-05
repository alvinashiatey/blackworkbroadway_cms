<template>
  <div
    @dragenter.prevent="toggleDrag"
    @dragleave.prevent="toggleDrag"
    @drop.prevent="handleDrop"
    @dragover.prevent
    :class="{ 'drag-over': drag }"
    class="play"
  >
    <div class="play__conatiner">
      <div class="play__wrapper">
        <div class="play__title col">
          <p>{{ play.title }} ({{ play.year }})</p>
          <p>{{ play.run }}</p>
        </div>
        <div class="play__artists col">
          <p v-for="artist in play.artists" :key="artist.uuid">
            {{ artist.name }}
            <span v-if="artist.role">({{ artist.role }})</span>
          </p>
        </div>
        <div class="play__detail col">
          <div class="detail">
            <p>{{ detail.content }}</p>
            <a v-if="detail.isLong" @click.prevent="handlePlayDetails">({{ lessMore }})</a>
          </div>
          <div class="tags">
            <p v-for="tag in play.tags" :key="tag.uuid">{{ tag.name }}</p>
          </div>
        </div>
      </div>
      <div class="btns__container">
        <div class="play__btns">
          [
          <a href @click.prevent="editPlay(play)">Edit</a> ] [
          <a href @click.prevent="deletePlay(play)">Delete</a> ] [
          <a href @click.prevent="handleImageUpload" ref="hoveredPlay">
            {{
              mediaButtonText
            }}
          </a>
          ]
        </div>
        <div class="state__wrapper" :class="{ published: play.state }">
          <p>{{ play.state ? "Published" : "Draft" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, onMounted, ref, watchEffect } from "@vue/runtime-core";
export default {
  name: "Play",
  props: ["play"],
  emits: ["edit", "upload"],
  setup(props, { emit }) {
    const playStore = inject("playStore");
    const imageData = inject("imageData");
    const navbar = inject("navbar");
    const hoveredPlay = ref(null);
    const mediaButtonText = ref("Upload Media");
    const lessMore = ref("More");
    const drag = ref(false);
    const toggleDrag = () => {
      drag.value = !drag.value;
    };
    const detail = ref({
      isLong: props.play.detail.length > 250,
      detail: props.play.detail,
      subDetail: `${props.play.detail.slice(0, 250)} ...`,
    });
    watchEffect(() => {
      props.play.images?.length
        ? (mediaButtonText.value = "Edit Media")
        : (mediaButtonText.value = "Upload Media");
    });

    const editPlay = (play) => {
      emit("edit", play);
    };

    const deletePlay = (play) => {
      let del = confirm("Are you sure you want to delete this play?");
      if (del) {
        playStore.actions.deletePlay(play).then(() => {
          if (!navbar.value.data.sortBy) return;
          playStore.actions.sortPlay(navbar.value.data.sortBy);
        });
      } else {
        alert("Delete cancelled");
      }
    };

    const handleImageUpload = () => {
      emit("upload", props.play.uuid, props.play.images);
    };

    const handlePlayDetails = () => {
      lessMore.value = lessMore.value === "More" ? "Less" : "More";
      if (lessMore.value === "More") {
        detail.value.content = detail.value.subDetail;
      } else {
        detail.value.content = detail.value.detail;
      }
    };

    const handleDrop = (e) => {
      toggleDrag();
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
      const file = e.dataTransfer.files[0];
      if (file && imageTypes.includes(file.type)) {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("play_id", props.play.uuid);
        if (props.play.images?.length) {
          confirm("Are you sure you want to replace the media?") &&
            playStore.actions.uploadMedia(formData, props.play.uuid)
        } else {
          playStore.actions.uploadMedia(formData, props.play.uuid);
        }
      }
    }

    onMounted(() => {
      hoveredPlay.value.addEventListener("mouseenter", () => {
        imageData.images = props.play.images;
        if (imageData.images?.length) imageData.show = true;
      });
      hoveredPlay.value.addEventListener("mouseleave", () => {
        imageData.show = false;
      });
      detail.value.isLong
        ? (detail.value.content = detail.value.subDetail)
        : (detail.value.content = detail.value.detail);
    });

    return {
      drag,
      detail,
      lessMore,
      hoveredPlay,
      mediaButtonText,
      editPlay,
      handleDrop,
      toggleDrag,
      deletePlay,
      handleImageUpload,
      handlePlayDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
.play {
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: var(--primary-color);
    filter: brightness(1.2);
  }
  &.drag-over {
    background-color: var(--black-color);
    color: var(--primary-color);
  }
  .play__conatiner {
    border-bottom: 1px solid #000;
    padding-bottom: 0.5rem;
    .play__wrapper {
      font-size: var(--font-size);
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      gap: 0.5rem;
      width: 100%;
      height: 100%;
      padding: 1rem;

      @media screen and (max-width: 60em) {
        grid-template-columns: 1fr;
      }

      .col {
        display: inline;
      }
      .play__detail {
        .tags {
          display: flex;
          flex-wrap: wrap;
          margin-top: 1em;
          gap: 0.5em;
          p {
            background-color: var(--primary-color);
            filter: brightness(1.4);
            padding-inline: 0.5em;
            border-radius: 0.5em;
            text-transform: capitalize;
          }
        }

        a {
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          display: inline;
          transition: all 0.3s ease-in-out;
          font-style: italic;
          background: black;
          color: var(--primary-color);
          &:hover {
            color: var(--secondary-color);
            background: none;
          }
        }
      }
    }
    .btns__container {
      display: flex;
      justify-content: space-between;
      padding-inline: 1rem;
      .play__btns {
        a {
          background: black;
          color: var(--primary-color);
          cursor: pointer;
          &:hover {
            color: var(--secondary-color);
            background: none;
          }
        }
      }
    }
    .state__wrapper {
      background-color: gold;
      padding-inline: 0.3rem;
      border-radius: 0.2rem;
      &.published {
        background: green;
      }
    }
  }
}
</style>

import { reactive, readonly } from "vue";
import PlayService from "../services/PlayService";
import ImageService from "../services/ImageService";

const state = reactive({
  plays: [],
  filtered: [],
});

const methods = {
  setPlays(plays) {
    state.plays = plays;
    state.filtered = state.plays;
    return state.plays;
  },

  appendPlay(play) {
    return state.plays.push(play);
  },

  updatePlay(data) {
    const index = state.plays.findIndex((p) => p.uuid === data.play.uuid);
    return (state.plays[index] = {
      ...data.play,
      artists: data.artists,
      tags: data.tags,
    });
  },

  deletePlay(data) {
    return (state.plays = state.plays.filter((p) => p.uuid !== data.uuid));
  },

  //Media
  appendMedia(media, uuid) {
    return state.plays.find((play) => play.uuid === uuid).images.push(media);
  },

  updateMedia(media, uuid) {
    const play = state.plays.find((p) => p.uuid === uuid);
    play.images.forEach((image) => {
      if (image.uuid === media.uuid) {
        image.alttext = media.alttext;
        image.caption = media.caption;
      }
    });
    return play;
  },

  deleteMedia(media, uuid) {
    const play = state.plays.find((p) => p.uuid === uuid);
    play.images = play.images.filter((image) => image.uuid !== media.uuid);
    return play;
  },
};

const actions = {
  async fetchPlays() {
    try {
      const plays = await PlayService.getPlays();
      methods.setPlays(plays);
    } catch (err) {
      console.log(err.message);
    }
  },
  async createPlay(play) {
    try {
      const newPlay = await PlayService.createPlay(play);
      methods.appendPlay(newPlay);
    } catch (err) {
      console.log(err.message);
    }
  },
  async updatePlay(play, uuid) {
    try {
      const updatedPlay = await PlayService.updatePlay(uuid, play);
      if (updatedPlay !== 0) {
        methods.updatePlay(play);
      } else {
        Error("Play not found");
      }
    } catch (err) {
      console.log(err.message);
    }
  },

  async deletePlay(play) {
    try {
      await PlayService.deletePlay(play.uuid);
      methods.deletePlay(play);
    } catch (err) {
      console.log(err.message);
    }
  },

  searchPlay(value = null) {
    if (value === "" || value === " " || value === null) {
      return (state.filtered = state.plays);
    }
    state.filtered = [...state.plays].filter((item) => {
      const splitSearch = value
        .split(",")
        .map((item) => item.trimStart().trimEnd())
        .filter((str) => /\S/.test(str));
      return (
        item.title
          .toLowerCase()
          .indexOf(splitSearch[splitSearch.length - 1]?.toLowerCase()) > -1 ||
        item.artists.some((artist) => {
          return (
            artist.name
              .toLowerCase()
              .indexOf(splitSearch[splitSearch.length - 1]?.toLowerCase()) > -1
          );
        })
      );
    });
    return state.filtered;
  },

  sortPlay(sortBy) {
    const sorted = [...state.filtered].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      return 0;
    });
    return (state.filtered = sorted);
  },

  //Media
  async uploadMedia(image, uuid) {
    try {
      const newImage = await ImageService.createImage(image);
      methods.appendMedia(newImage, uuid);
    } catch (err) {
      console.log(err.message);
    }
  },

  async updateMedia(media, uuid, play_uuid) {
    try {
      const updatedPlay = await ImageService.updateImage(uuid, media);
      if (updatedPlay !== 0) {
        methods.updateMedia({ ...media, uuid }, play_uuid);
      } else {
        Error("Play not found");
      }
    } catch (err) {
      console.log(err.message);
    }
  },

  async deleteMedia(uuid, play_uuid) {
    try {
      const updatedPlay = await ImageService.deleteImage(uuid);
      if (updatedPlay !== 0) {
        methods.deleteMedia({ uuid }, play_uuid);
      } else {
        Error("Play not found");
      }
    } catch (err) {
      console.log(err.message);
    }
  },
};

const getters = {
  plays: () => {
    if (state.plays.length > 0) {
      return [...state.plays].sort((a, b) => {
        return b.year - a.year;
      });
    }
  },
};

export default {
  state: readonly(state),
  actions,
  methods,
  getters,
};

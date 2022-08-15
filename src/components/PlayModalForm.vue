<template>
  <div class="form__container">
    <div class="form__body">
      <div class="form__buttons">
        <div class="form__group check state">
          <div
              class="check__container"
              :class="{ publish: data.state }"
          >
            <input
                class="form__input"
                type="checkbox"
                id="state"
                v-model="data.state"
            />
            <label
                class="form__label"
                for="state"
            >{{ data.state ? 'PUBLISHED' : 'DRAFT' }}</label>
          </div>
        </div>
        <div class="form__group">
          <button
              @click="handleForm"
              class="form__button"
              type="submit"
          >{{ buttonText }}
          </button>
        </div>
        <div class="form__group">
          <button
              class="form__button cancel"
              type="button"
              @click="cancel"
          >Cancel
          </button>
        </div>
      </div>
      <div class="form__body-wrapper">
        <form class="form" @submit.enter.prevent>
          <div class="form__group">
            <label class="form__label" for="title">Title:</label>
            <input
                class="form__input"
                type="text"
                id="title"
                v-model.trim="data.title"
                autocomplete="on"
                required
            />
          </div>
          <div class="form__group">
            <label class="form__label" for="year">Year:</label>
            <input
                class="form__input"
                type="text"
                id="year"
                v-model.number="data.year"
                @keypress="numbersOnly"
                autocomplete="on"
                :maxlength="4"
                placeholder="YYYY"
            />
          </div>
          <div class="form__group check">
            <label class="form__label" for="circa">Circa:</label>
            <input
                class="form__input"
                type="checkbox"
                id="circa"
                v-model="data.circa"
            />
          </div>
          <div class="form__group">
            <label class="form__label" for="run">Run:</label>
            <input
                class="form__input"
                type="text"
                id="run"
                v-model="data.run"
                :maxlength="255"
                autocomplete="on"
                placeholder="DATE, MONTH, YEAR - DATE, MONTH, YEAR"
            />
          </div>
          <ArtistInput ref="artists" :data="artists" :reset="data.reset"/>
          <div class="form__group">
            <label class="form__label" for="detail">Detail:</label>
            <textarea
                spellcheck="true"
                lang="en"
                class="form__input"
                id="detail"
                v-model="data.detail"
                rows="8"
                cols="50"
                autocomplete="on"
            ></textarea>
          </div>
          <TagsInput ref="tags" :data="tags"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ArtistInput from "@/components/ArtistInput.vue";
import TagsInput from "@/components/TagsInput.vue";
import EventBus from "@/Common/EventBus";
import {inject, onBeforeMount, watchEffect} from "@vue/runtime-core";
import {reactive, ref} from "@vue/reactivity";

export default {
  name: "PlayModalForm",
  components: {
    ArtistInput,
    TagsInput
  },
  props: ["data"],
  setup(props) {
    const playStore = inject("playStore");
    const navbar = inject("navbar");
    let artists = ref([]);
    let buttonText = ref("Submit");
    let tags = ref([]);
    let data = reactive({
      title: "",
      year: "",
      circa: false,
      run: "",
      state: false,
      clicked: props.data.clicked,
      reset: false
    });



    data.classObject = {publish: data.state, check__container: true};

    const sendData = () => ({
      play: {
        title: data.title,
        year: data.year,
        circa: data.circa,
        run: data.run,
        detail: data.detail,
        state: data.state,
      },
      artists: artists.value?.data.contributors[0].name !== '' ? artists.value.data.contributors : [],
      tags: tags.value?.data.tags,
    });

    const submitPlay = async () => {
      try{
        let d = sendData();
        playStore.actions.createPlay(d).then(() => {
          if (!navbar.value.data.sortBy) return;
          playStore.actions.sortPlay(navbar.value.data.sortBy)
        }).catch((err)=>{
          if (err.response && err.response.status === 403) {
            EventBus.dispatch("logout");
          }
        })
      }catch (e){
        console.log(e.message)
      }

    };

    const updatePlay = async () => {
      try{
        let d = sendData();
        d.play.uuid = props.data.item.uuid;
        playStore.actions.updatePlay(d, props.data.item.uuid).then(() => {
          if (!navbar.value.data.sortBy) return;
          playStore.actions.sortPlay(navbar.value.data.sortBy)
        }).catch((err)=>{
          if (err.response && err.response.status === 403) {
            EventBus.dispatch("logout");
          }
        })
      } catch (e){
        console.log(e.message)
      }
    };

    const numbersOnly = (e) => {
      e = e ? e : window.event;
      var charCode = e.which ? e.which : e.keyCode;
      if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
      ) {
        e.preventDefault();
      } else {
        return true;
      }
    };

    const setupEdit = () => {
      data.title = props.data.item.title;
      data.year = props.data.item.year;
      data.circa = props.data.item.circa;
      data.run = props.data.item.run;
      data.detail = props.data.item.detail;
      data.state = props.data.item.state;
      artists.value = props.data.item.artists;
      tags.value = props.data.item.tags;
      buttonText.value = "Update";
    };

    const clearInput = ()=>{
      data.title = "";
      data.year = "";
      data.circa = false;
      data.run = "";
      data.detail = "";
      data.state = "draft";
      artists.value = [];
      tags.value = [];
      buttonText.value = "Submit";
      data.reset = true;
    }

    const cancel = () => {
      clearInput()
      props.data.cancel();
    };

    const handleForm = async () => {
      try {
        if (buttonText.value === "Submit") {
          await submitPlay().then(props.data.save);
        } else if (buttonText.value === "Update") {
          await updatePlay().then(props.data.save);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    onBeforeMount(() => {
      if (props.data?.item === undefined) return;
      if (Object.keys(props.data?.item || {}).length !== 0) {
        setupEdit();
      }
    });

    watchEffect(()=>{
      data.clicked = props.data.clicked
      if(data.clicked === "add") {
        clearInput()
      }
    })

    return {
      data,
      tags,
      artists,
      buttonText,
      cancel,
      submitPlay,
      handleForm,
      numbersOnly,
    };
  },
};
</script>

<style lang="scss" scoped>
.form__container {
  z-index: 20;
  color: var(--black-color);
  width: 100%;
  background-color: var(--primary-color);
  margin: 0 auto;
  padding: 1rem 1rem 3rem 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  font-size: var(--font-size);
  position: absolute;
  inset: 0;
  overflow-y: scroll;

  .form__body {
    margin: 0 auto;
    width: 40rem;
    height: auto;
    display: flex;
    gap: 2em;
    @media screen and (max-width: 60em) {
      flex-direction: column-reverse;
      width: 80vw;
    }

    .form__buttons {
      display: flex;
      flex-direction: column;
      gap: 1em;

      button {
        border-radius: 0.3rem;
        background-color: var(--secondary-color);
        border: 0;
        color: #d0cab2;

        &:hover {
          cursor: pointer;
          filter: brightness(1.2) drop-shadow(
                  0 0.06rem 0.07rem rgba(
                          0,
                          0,
                          0,
                          0.3
                  )
          );
        }

        width: 100%;
        padding: 0.5rem;
        border: 0;
        font-size: var(--font-size);

        &:focus {
          outline: none;
          border-color: var(--secondary-color);
        }

        &.cancel {
          background-color: var(
                  --secondary-color
          );
          filter: contrast(6.2);
          transition: all 0.2s ease-in-out;

          &:hover {
            filter: contrast(8) drop-shadow(
                    0 0.06rem 0.07rem rgba(
                            0,
                            0,
                            0,
                            0.3
                    )
            );
          }
        }
      }

      .state {
        &.check {
          display: flex;
          align-items: center;
        }

        input[type="checkbox"] {
          width: 1.2rem;
          height: 1.2rem;
        }

        justify-content: end;

        .check__container {
          border-radius: 0.3rem;
          padding: 0.5rem;
          width: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: gold;
          gap: 0.2rem;

          &.publish {
            background-color: green;
          }
        }
      }
    }

    .form__body-wrapper {
      form {
        width: 100%;
        position: relative;

        .form__group {
          margin-block-start: 0.5rem;
          width: 100%;

          input[type="checkbox"] {
            width: 1.2rem;
            height: 1.2rem;
          }

          input[type="text"],
          textarea,
          button {
            width: 100%;
            padding: 0.5rem;
            border: 0;
            border-bottom: 1px solid #d0cab2;
            font-size: var(--font-size);

            &:focus {
              outline: none;
              border-color: var(
                      --secondary-color
              );
            }
          }

          textarea {
            resize: none;
          }

          button {
            background-color: var(
                    --secondary-color
            );
            border: 0;
            color: #d0cab2;

            &:hover {
              cursor: pointer;
              filter: brightness(1.2);
            }

            &.cancel {
              background-color: var(
                      --primary-color
              );
              color: var(
                      --black-color
              );
              transition: all 0.2s ease-in-out;

              &:hover {
                cursor: pointer;
              }
            }
          }

          &.check {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>

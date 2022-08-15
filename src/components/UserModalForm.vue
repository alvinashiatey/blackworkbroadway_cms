<template>
  <div class="form__container">
    <div class="form__body">
      <div class="form__body-wrapper">
        <form class="form" @submit.prevent>
          <div class="form__group">
            <label class="form__label" for="name">Name:</label>
            <input
                class="form__input"
                type="text"
                id="title"
                v-model.trim="data.name"
                placeholder="FIRSTNAME LASTNAME"
                required
            />
          </div>
          <div class="form__group">
            <label class="form__label" for="email">EMAIL:</label>
            <input
                class="form__input"
                type="text"
                id="year"
                v-model.trim="data.email"
                required
            />
          </div>
          <div class="form__group">
            <label class="form__label" for="password">PASSWORD:</label>
            <input
                class="form__input"
                type="password"
                id="year"
                v-model.trim="data.password"
                required
            />
          </div>
          <div class="form__buttons">

            <div class="form__group">
              <button
                  @click="submitUser"
                  class="form__button"
                  type="submit"
              >Submit
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
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "@vue/reactivity";
import {onBeforeUnmount} from "@vue/runtime-core";

export default {
  name: "UserModalForm",
  props: ["data"],
  setup(props) {
    let data = reactive({
      name: "",
      email: "",
      password: "",

    });

    const sendData = () => ({
      name: data.name,
      email: data.email,
      password: data.password,
      role: JSON.parse(localStorage?.user).role === 1 ? "admin" : "reader"
    });

    const submitUser = async () => {
      try {
        if(confirm("kindly confirm the addition if the user.")){
          let d = sendData();
          console.log(d)
          await props.data.createUser(d).then(props.data.hideModal)
        }
      } catch (e) {
        console.log(e.message)
      }
    };


    const cancel = () => {
      data.name = "";
      data.email = "";
      data.password = "";
      props.data.cancel();
    };

    onBeforeUnmount(()=>{
      cancel()
    })


    return {
      data,
      cancel,
      submitUser,
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



    .form__body-wrapper {
      form {
        width: 100%;
        position: relative;

        .form__group {
          margin-block-start: 0.5rem;
          width: 100%;


          input[type="text"],
          input[type="password"],
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
        }
        .form__buttons {
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

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

        }
      }
    }
  }
}
</style>

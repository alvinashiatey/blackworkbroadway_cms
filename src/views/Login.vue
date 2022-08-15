<template>
  <div class="login">
    <div class="login__wrapper">
      <div class="login__container">
        <form @submit.prevent>
          <div class="login__header">
            <h3>Login</h3>
          </div>
          <div class="login__form">
            <div class="form__group">
              <input
                  type="text"
                  class="form__input"
                  placeholder="Email"
                  v-model="data.email"
                  autocomplete="on"
              />
            </div>
            <div class="form__group">
              <input
                  type="password"
                  class="form__input"
                  placeholder="Password"
                  v-model="data.password"
                  autocomplete="on"
              />
            </div>
            <div class="form__group">
              <button
                  class="btn btn--primary btn--block"
                  @click="login"
              >Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from '@vue/reactivity'
import userStore from "@/store/userStore.js";
import {useRouter} from 'vue-router';

export default {
  name: "Home",
  setup() {
    const router = useRouter();
    let data = reactive({
      email: "",
      password: ""
    })

    let login = () => {
      try {
        userStore.actions.login(data)
            .then(() => {
              router.push({name: 'Home'})
            })
            .catch(() => {
              document.querySelectorAll(".form__input").forEach(e => e.classList.add("error"))
              alert("Invalid credentials")
              document.querySelector("input[type=password]").value = ""
            })
      } catch (e) {
        alert("Invalid credentials")
      }

    }

    return {
      data,
      login
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .login__wrapper {
    width: 400px;
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

    .login__container {
      padding: 20px;
      text-align: center;

      .login__header {
        h3 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        p {
          font-size: 14px;
          margin-bottom: 20px;
        }
      }

      .login__form {
        .form__group {
          padding-block-start: 0.5rem;

          .form__input {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            font-size: 14px;

            &:focus {
              outline: none;
            }

            &.error {
              border-color: rgba(
                      255,
                      0,
                      0,
                      0.5
              );
            }
          }

          .btn {
            width: 100%;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-size: 14px;
            background-color: var(
                    --primary-color
            );
            transition: all 0.3s ease-in-out;

            &:hover {
              cursor: pointer;
              filter: brightness(120%) drop-shadow(
                      0 1px 1px var(
                              --primary-color
                      )
              );
            }

            &:focus {
              outline: none;
            }
          }
        }
      }
    }
  }
}
</style>
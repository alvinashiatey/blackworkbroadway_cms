<template>
        <div class="login">
                <div class="login__wrapper">
                        <div class="login__container">
                                <form @submit.prevent>
                                        <div class="login__header">
                                                <h3>Login</h3>
                                                <p>Please enter your credentials to login.</p>
                                        </div>
                                        <div class="login__form">
                                                <div class="form__group">
                                                        <input
                                                                type="text"
                                                                class="form__input"
                                                                placeholder="email"
                                                                v-model="data.email"
                                                        />
                                                </div>
                                                <div class="form__group">
                                                        <input
                                                                type="password"
                                                                class="form__input"
                                                                placeholder="Password"
                                                                v-model="data.password"
                                                        />
                                                </div>
                                                <div class="form__group">
                                                        <button
                                                                class="btn btn--primary btn--block"
                                                                @click="login"
                                                        >Login</button>
                                                </div>
                                        </div>
                                </form>
                        </div>
                </div>
        </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import userStore from "../store/userStore.js";
import { useRouter } from 'vue-router';
import { onMounted } from '@vue/runtime-core';

export default {
        name: "Home",
        setup() {
                const router = useRouter();
                let data = reactive({
                        email: "",
                        password: ""
                })

                let login = () => {
                        userStore.actions.login(data)
                                .then(() => {
                                        router.push({ name: 'Home' })
                                })
                                .catch(() => {
                                        alert("Invalid credentials")
                                })
                }

                onMounted(() => {
                        userStore.actions.checkLogin()
                                .then((res) => {
                                        if (res) {
                                                router.push({ name: 'Home' })
                                        }
                                })

                })

                return {
                        data,
                        login
                }
        }
}
</script>
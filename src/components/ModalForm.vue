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
                                        >{{ buttonText }}</button>
                                </div>
                                <div class="form__group">
                                        <button
                                                class="form__button cancel"
                                                type="button"
                                                @click="cancel"
                                        >Cancel</button>
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
                                                />
                                        </div>
                                        <ArtistInput ref="artists" :data="artists" />
                                        <div class="form__group">
                                                <label class="form__label" for="detail">Detail:</label>
                                                <textarea
                                                        class="form__input"
                                                        id="detail"
                                                        v-model="data.detail"
                                                        rows="8"
                                                        cols="50"
                                                        autocomplete="on"
                                                ></textarea>
                                        </div>
                                        <TagsInput ref="tags" :data="tags" />
                                </form>
                        </div>
                </div>
        </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import ArtistInput from "./ArtistInput.vue";
import { inject, onBeforeMount } from "@vue/runtime-core";
import TagsInput from "./TagsInput.vue";

export default {
        name: "ModalForm",
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
                });

                data.classObject = { publish: data.state, check__container: true };

                Object.prototype.isEmpty = function () {
                        return Object.keys(this).length === 0;
                };

                const sendData = () => ({
                        play: {
                                title: data.title,
                                year: data.year,
                                circa: data.circa,
                                run: data.run,
                                detail: data.detail,
                                state: data.state,
                        },
                        artists: artists.value.data.contributors[0].name !== '' ? artists.value.data.contributors : [],
                        tags: tags.value.data.tags,
                });

                const submitPlay = async () => {
                        let d = sendData();
                        playStore.actions.createPlay(d).then(() => {
                                if (!navbar.value.data.sortBy) return;
                                playStore.actions.sortPlay(navbar.value.data.sortBy)
                        });
                };

                const updatePlay = async () => {
                        let d = sendData();
                        d.play.uuid = props.data.item.uuid;
                        playStore.actions.updatePlay(d, props.data.item.uuid).then(() => {
                                if (!navbar.value.data.sortBy) return;
                                playStore.actions.sortPlay(navbar.value.data.sortBy)
                        });
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

                const cancel = () => {
                        data.title = "";
                        data.year = "";
                        data.circa = false;
                        data.run = "";
                        data.detail = "";
                        data.state = "draft";
                        artists.value = [];
                        tags.value = [];
                        buttonText.value = "Submit";
                        props.data.cancel();
                };

                const handleForm = async () => {
                        try {
                                if (buttonText.value === "Submit") {
                                        await submitPlay();
                                } else if (buttonText.value === "Update") {
                                        await updatePlay();
                                }
                                props.data.save();
                        } catch (err) {
                                console.log(err.message);
                        }
                };

                onBeforeMount(() => {
                        if (!props.data.item.isEmpty()) {
                                setupEdit();
                        }
                });

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
                                        filter: brightness(1.2)
                                                drop-shadow(
                                                        0 0.06rem 0.07rem
                                                                rgba(
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
                                                filter: contrast(8)
                                                        drop-shadow(
                                                                0 0.06rem
                                                                        0.07rem
                                                                        rgba(
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
                                                        transition: all 0.2s
                                                                ease-in-out;
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

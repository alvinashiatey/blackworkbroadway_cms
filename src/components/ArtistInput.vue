<template>
        <div class="form__group">
                <label class="form__label" for="Contributors">Contributors</label>
                <div
                        v-for="(constributor, index) in data.contributors"
                        :key="`artist-${index}`"
                        class="contributor__input"
                >
                        <button @click.enter.prevent="removeField(index)" class="close__btn"></button>
                        <div class="artist__role">
                                <input
                                        class="form__input"
                                        type="text"
                                        id="artist"
                                        v-model.trim="constributor.name"
                                        placeholder="NAME"
                                        :maxlength="255"
                                />
                                <input
                                        class="form__input"
                                        type="text"
                                        id="role"
                                        v-model.trim="constributor.role"
                                        placeholder="ROLE"
                                        :maxlength="255"
                                />
                        </div>
                </div>
                <div class="add__btn">
                        <p @click="addField">✚</p>
                </div>
        </div>
</template>

<script>
import { reactive } from "@vue/reactivity"
import { onBeforeMount } from "@vue/runtime-core"

export default {
        name: "ArtistInput",
        props: ["data"],
        setup(props) {
                let data = reactive({
                        contributors: [{ name: "", role: "" }]
                })

                const addField = () => {
                        data.contributors.push({ name: "", role: "" })
                }

                const removeField = (index) => {
                        if (data.contributors.length > 1) {
                                data.contributors.splice(index, 1)
                        }
                }

                const editData = () => {
                        data.contributors = props.data
                }

                onBeforeMount(() => {
                        if (props.data?.length > 0) {
                                editData()
                        }
                })

                return {
                        data,
                        addField,
                        removeField,
                }
        },
}
</script>

<style lang="scss" scoped>
.form__group {
        width: 100%;
        .contributor__input {
                position: relative;
                text-align: center;
                button {
                        border-radius: 50%;
                        padding: 0.5em;
                        width: 30px;
                        height: 30px;
                        border: 2px solid #181818;
                        color: #181818;
                        position: absolute;
                        right: -0.5rem;
                }
                button:hover {
                        border: 2px solid #181818;
                        background-color: tomato;
                        color: #ffffff;
                        cursor: pointer;
                }

                button::before {
                        content: " ";
                        position: absolute;
                        display: block;
                        background-color: #181818;
                        width: 2px;
                        left: 12px;
                        top: 5px;
                        bottom: 5px;
                        transform: rotate(45deg);
                }
                button::after {
                        content: " ";
                        position: absolute;
                        display: block;
                        background-color: #181818;
                        height: 2px;
                        top: 12px;
                        left: 5px;
                        right: 5px;
                        transform: rotate(45deg);
                }
        }
        .artist__role {
                display: flex;
                gap: 1rem;
        }

        input[type="text"] {
                width: 100%;
                padding: 0.5rem;
                border: 0;
                border-bottom: 1px solid #d0cab2;
                font-size: var(--font-size);
                margin-block-start: 0.5rem;
                &:focus {
                        outline: none;
                        border-color: #000;
                }
        }
        .add__btn {
                p {
                        cursor: pointer;
                        font-size: 2rem;
                        &:hover {
                                color: var(--secondary-color);
                        }
                }
        }
}
</style>
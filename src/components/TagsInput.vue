<template>
        <div class="tags">
                <div class="tags__container">
                        <div class="tags__wrapper">
                                <div class="tags__entry">
                                        <div class="tag" v-for="tag in data.tags" :key="tag.name">
                                                <span class="tag__text">{{ tag.name }}</span>
                                                <span
                                                        class="tag__remove"
                                                        @click="handleRemove(tag)"
                                                >✖</span>
                                        </div>
                                </div>
                                <div class="tags__input">
                                        <input
                                                type="text"
                                                placeholder="Add tags"
                                                v-model="data.tagInput.name"
                                                @keydown.enter.prevent="handleAdd"
                                        />
                                </div>
                        </div>
                </div>
        </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { onBeforeMount } from '@vue/runtime-core';
export default {
        props: ["data"],
        setup(props) {
                const data = reactive({
                        tags: [],
                        tagInput: {
                                name: "",
                        }
                });

                const handleAdd = () => {
                        if (data.tagInput.name !== "") {
                                data.tags.push({ name: data.tagInput.name.toLowerCase() });
                                data.tagInput.name = '';
                        }
                }

                const editData = () => {
                        data.tags = props.data
                }

                const handleRemove = (t) => {
                        data.tags = data.tags.filter(tag => tag !== t);
                }

                onBeforeMount(() => {
                        if (props.data?.length > 0) {
                                editData()
                        }
                })

                return {
                        data,
                        handleAdd,
                        handleRemove
                }
        },
}
</script>

<style lang="scss" scoped>
.tags {
        padding-top: 1rem;
        width: 100%;
        .tags__container {
                width: inherit;
                .tags__wrapper {
                        width: inherit;
                        .tags__entry {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 0.5em;
                                .tag {
                                        background-color: #fefefe;
                                        filter: drop-shadow(
                                                0 1px 0.035em var(--black-color)
                                        );
                                        padding-inline: 0.5em;
                                        border-radius: 0.25em;
                                        span {
                                                text-transform: capitalize;
                                                &:first-child {
                                                        letter-spacing: normal;
                                                        padding-inline-end: 0.5em;
                                                }
                                                &.tag__remove:hover {
                                                        color: var(
                                                                --secondary-color
                                                        );
                                                        filter: contrast(6.2);
                                                        cursor: pointer;
                                                }
                                                &.tag__text {
                                                        cursor: default;
                                                }
                                        }
                                }
                        }
                        .tags__input {
                                width: inherit;
                                input {
                                        background-color: var(--primary-color);
                                        width: inherit;
                                        border: none;
                                        border-bottom: 1px solid
                                                var(--black-color);
                                        padding: 0.5rem;
                                        font-size: 1.2rem;
                                        outline: none;
                                }
                        }
                }
        }
}
</style>

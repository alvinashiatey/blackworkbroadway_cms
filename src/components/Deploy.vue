<template>
        <div :class="{ 'hide': hide }" class="deploy">
                <div @click="handlePublish" class="deploy__container">
                        <h3>Deploy</h3>
                </div>
        </div>
</template>

<script>
import { watchEffect, inject } from "@vue/runtime-core";
import { ref } from "vue";
export default {
        name: "Publish",
        props: ["updated"],
        setup(props) {
                const playStore = inject("playStore");
                const hide = ref(true);
                const handlePublish = async () => {
                        await playStore.actions.deploy()
                        hide.value = true;
                }
                const hideDeploy = () => {
                        setTimeout(() => {
                                hide.value = true;
                        }, 5000);
                }

                const showDeploy = () => {
                        console.log('there')
                        hide.value = false;
                }

                watchEffect(() => {
                        if (props.updated) {
                                showDeploy();
                        }
                });


                return {
                        hide,
                        handlePublish,
                }
        }
}
</script>

<style lang="scss" scoped>
.deploy {
        cursor: pointer;
        position: absolute;
        padding: 1rem;
        margin-block-end: 0.5rem;
        width: auto;
        height: auto;
        bottom: 0;
        right: 0;
        &.hide {
                animation: move 300ms ease-in-out forwards;
        }
        &.show {
                animation: move 300ms ease-in-out reverse;
        }
        .deploy__container {
                width: inherit;
                height: inherit;
                color: white;
                padding: 0.5rem;
                border-radius: 0.5rem;
                display: inline;
                background-color: #32611f;
                &:hover {
                        filter: drop-shadow(0 1px 0.035em var(--black-color));
                }
                h3 {
                        font-size: 1.5rem;
                        display: inline;
                        font-weight: normal;
                }
        }
        @keyframes move {
                0% {
                        transform: translateX(0);
                }
                100% {
                        transform: translateX(100%);
                }
        }
}
</style>
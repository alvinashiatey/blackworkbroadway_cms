<template>
        <div :class="{ 'show': state }" class="menu__container">
                <div class="menu__item" v-for="item of items" :key="item">
                        <div class="menu__item-text" v-on:click="handleClick">
                                <p>{{ item }}</p>
                        </div>
                </div>
        </div>
</template>

<script>
export default {
        name: "DropMenu",
        props: {
                items: Array,
                state: Boolean
        },
        setup(props, { emit }) {
                const handleClick = function (e) {
                        e.stopPropagation()
                        emit('click', e.target.textContent)
                }
                return {
                        handleClick
                }
        }

}
</script>

<style lang="scss" scoped>
.menu__container {
        background-color: var(--white-color);
        padding: 0.5rem;
        border-radius: 0.5rem;
        margin-block-start: 0.5rem;
        position: absolute;
        right: 0;
        flex-direction: column;
        gap: 0.25rem;
        display: none;

        .menu__item {
                width: 8em;
                text-align: center;
                padding: 0.25rem;
                border-radius: 0.25rem;
                background-color: var(--5-white-color);
                filter: drop-shadow(0 0 0.025rem rgba(0, 0, 0, 0.5));
                &:hover {
                        background-color: var(--10-white-color);
                        cursor: pointer;
                        filter: drop-shadow(
                                0 0.025rem 0.025rem rgba(0, 0, 0, 0.5)
                        );
                }
        }

        &.show {
                display: flex;
        }
}
</style>
<template>
        <div class="editicon__conatiner">
                <div class="editicons">
                        <div v-show="store.edit" class="icon">
                                <div class="cancel__btn">
                                        <button @click.prevent="handleCancel">cancel</button>
                                </div>
                        </div>
                </div>
        </div>
</template>
<script>

export default {
        props: ["store"],
        setup(props) {
                const handleCancel = () => {
                        props.store.edit = false;
                }

                return {
                        handleCancel
                }
        }
}
</script>
<style lang="scss" scoped>
.editicon__conatiner {
        .editicons {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 0.5rem;
                .icon {
                        .cancel__btn {
                                button {
                                        background-color: tomato;
                                        border: none;
                                        color: var(--primary-color);
                                        padding-inline: 0.5rem;
                                        cursor: pointer;
                                        &:hover {
                                                filter: brightness(1.2);
                                                color: var(--5-white-color);
                                        }
                                }
                        }
                }
        }
}
</style>
<template>
        <nav>
                <div class="nav__container">
                        <div class="nav__wrapper">
                                <div class="title">
                                        <a class="brand-logo">
                                                Black Work
                                                <br />Broadway
                                        </a>
                                </div>
                                <div @click="addField" class="add__btn">
                                        <p>✚</p>
                                </div>
                        </div>
                        <div class="nav-lower__wrapper">
                                <div class="nav-lower__container">
                                        <div class="search">
                                                <div class="search__input">
                                                        <input
                                                                @input="onChange"
                                                                type="text"
                                                                v-model="data.search"
                                                                placeholder="Search"
                                                        />
                                                </div>
                                                <div class="search__title">
                                                        <button @click.prevent>Search</button>
                                                </div>
                                        </div>
                                </div>
                                <div class="logout">
                                        [
                                        <a href="#" @click="handleLogout">Logout</a> ]
                                </div>
                        </div>
                        <div class="nav-sort__wrapper">
                                <div class="nav-sort__container">
                                        <div class="sort">
                                                <div class="sort__title">Sort By:</div>
                                                <div class="sort__input">
                                                        <select
                                                                v-model="data.sortBy"
                                                                @change="handleSelect($event)"
                                                        >
                                                                <option value="title">Title</option>
                                                                <option value="year">Year</option>
                                                        </select>
                                                </div>
                                        </div>
                                        <div class="entry__count">
                                                <div class="total">Entries: {{ total }}</div>
                                        </div>
                                </div>
                        </div>
                </div>
        </nav>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
export default {
        name: 'NavBar',
        emits: ['addField', 'logout'],
        props: ['total'],
        setup(props, { emit }) {
                const data = reactive({
                        search: "",
                        sortBy: null
                })

                const playStore = inject('playStore')
                const addField = () => {
                        emit('addField')
                }

                const handleLogout = () => {
                        emit('logout')
                }

                const handleSelect = (e) => {
                        if (!data.sortBy) return;
                        playStore.actions.sortPlay(data.sortBy.toLowerCase())
                }

                const onChange = () => {
                        playStore.actions.searchPlay(data.search);
                }

                return {
                        data,
                        onChange,
                        addField,
                        handleLogout,
                        handleSelect
                }
        }
}
</script>

<style lang="scss" scoped>
nav {
        border-bottom: 1px solid #000;
        .nav__container {
                .nav__wrapper {
                        padding-inline: var(--padding-inline);
                        padding-block: 0.5rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #000;

                        .brand-logo {
                                font-size: 2em;
                                font-weight: bold;
                                text-transform: uppercase;
                                line-height: 0.875em;
                                font-size: 2.5rem;
                        }
                        .add__btn {
                                font-size: var(--font-size-lg);
                                cursor: pointer;
                                padding: 0.5rem;
                                border-radius: 0.5rem;
                                background-color: var(--black-color);
                                color: var(--primary-color);
                                user-select: none;
                                &:hover {
                                        background-color: #fff;
                                        color: var(--primary-color);
                                }
                        }
                }
                .nav-lower__wrapper {
                        padding-inline: var(--padding-inline);
                        border-bottom: 1px solid #000;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .nav-lower__container {
                                padding-block: 0.5rem;
                                .search {
                                        display: flex;
                                        width: 100%;
                                        justify-content: space-between;
                                        align-items: center;

                                        .search__input {
                                                width: 100%;
                                                input {
                                                        width: 100%;
                                                        border: none;

                                                        &:focus {
                                                                outline: none;
                                                        }
                                                }
                                        }
                                        .search__title {
                                                button {
                                                        border: none;
                                                        background-color: var(
                                                                --black-color
                                                        );
                                                        color: var(
                                                                --primary-color
                                                        );
                                                        &:hover {
                                                                cursor: pointer;
                                                                background-color: #fefefe;
                                                                border-left: 1px
                                                                        solid
                                                                        var(
                                                                                --black-color
                                                                        );
                                                                color: var(
                                                                        --primary-color
                                                                );
                                                        }
                                                }
                                        }
                                }
                        }
                }
                .nav-sort__wrapper {
                        padding-inline: var(--padding-inline);
                        .nav-sort__container {
                                padding-block: 0.5rem;
                                display: flex;
                                justify-content: space-between;
                                .sort {
                                        width: 80%;
                                        display: flex;
                                        gap: 0.5em;
                                        .sort__input {
                                                select {
                                                        border: none;
                                                        &:focus {
                                                                outline: none;
                                                        }
                                                }
                                        }
                                }
                        }
                }
        }
}
</style>
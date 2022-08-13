<template>
  <nav>
    <div class="nav__container">
      <div class="nav__wrapper">
        <div @click="cancelToHome" class="title">
          <a class="brand-logo">
            Black Work
            <br/>Broadway
          </a>
        </div>
        <NavButton v-on:menu="handleDropMenu"/>
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
        <div class="logout_publish">
          <div class="publish">
            [
            <a href="#" @click="handleDeploy">Deploy</a> ]
          </div>
          <div class="logout">
            [
            <a href="#" @click="handleLogout">Logout</a> ]
          </div>
        </div>
      </div>
      <div class="nav-sort__wrapper">
        <div class="nav-sort__container">
          <div v-show="store.showSort" class="sort">
            <div class="sort__title">Sort By:</div>
            <div class="sort__input">
              <select
                  v-model="data.sortBy"
                  @change="handleSelect($event)"
              >
                <option value="year ascend">Year [First-Last]</option>
                <option value="year">Year [Last-First]</option>
                <option value="title">Title [A-Z]</option>
                <option value="title descend">Title [Z-A]</option>
              </select>
            </div>
          </div>
          <div v-show="store.showSort" class="entry__count">
            <div class="total">Entries: {{ store.total() }}</div>
          </div>
          <div v-show="data.editBar" class="edit__bar">
            <div class="edit__btn">
              <button @click.prevent="handleEdit">Edit</button>
            </div>
            <EditMenuBar :store="store.editAbout"/>
          </div>
          <div v-show="store.showAdd" class="add__bar">
            <div class="add__header">
              <h1>Add New Play</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import NavButton from "./NavButton.vue"
import EditMenuBar from "./EditMenuBar.vue"
import {reactive} from '@vue/reactivity'
import {inject} from '@vue/runtime-core'

export default {
  name: 'NavBar',
  emits: ['addField', 'logout'],
  props: ['store'],
  components: {
    NavButton,
    EditMenuBar
  },
  setup(props) {
    const data = reactive({
      search: "",
      sortBy: null,
      editBar: false,
    })

    const playStore = inject('playStore')

    const handleDropMenu = (d) => {
      if (d === "Add Play") {
        data.editBar = false;
        props.store.handleAddbutton();
      } else if (d === "View About") {
        data.addBar = false;
        data.editBar = !data.editBar;
        props.store.handleAboutButton();
      }
    }

    const cancelToHome = () => {
      props.store.cancel()
      data.editBar = false;
    }

    const handleEdit = () => {
      props.store.handleEditAbout()
    }

    const handleLogout = () => {
      props.store.handleLogout()
    }

    const handleSelect = (e) => {
      if (!data.sortBy) return;
      switch (data.sortBy) {
        case "year ascend":
          playStore.actions.sortPlay(data.sortBy.split(" ")[0].toLowerCase()).reverse()
          break;
        case "title descend":
          playStore.actions.sortPlay(data.sortBy.split(" ")[0].toLowerCase()).reverse()
          break;
        default:
          playStore.actions.sortPlay(data.sortBy.toLowerCase())
      }
    }

    const onChange = () => {
      playStore.actions.searchPlay(data.search);
    }

    const handleDeploy = async () => {
      if (confirm("Are you sure you want to deploy a new build?")) {
        await playStore.actions.deploy()
        props.store.alertData.show = false
        props.store.alertData.message = ""
      }
    }

    return {
      data,
      onChange,
      handleEdit,
      handleSelect,
      handleLogout,
      cancelToHome,
      handleDeploy,
      handleDropMenu,
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

      .title {
        cursor: pointer;

        .brand-logo {
          font-size: 2em;
          font-weight: bold;
          text-transform: uppercase;
          line-height: 0.875em;
          font-size: 2.5rem;
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
                border-left: 1px solid var(
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

      .logout_publish {
        display: flex;
        gap: 0.5rem;
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

        .edit__bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 auto;
          width: 80%;

          .edit__btn {
            button {
              border: none;
              background-color: var(
                      --black-color
              );
              padding-inline: 0.5rem;
              color: var(
                      --primary-color
              );

              &:hover {
                cursor: pointer;
                background-color: #fefefe;
                color: var(
                        --primary-color
                );
              }
            }
          }
        }

        .add__bar {
          width: 80%;
          margin: 0 auto;

          .add__header {
            h1 {
              font-size: var(
                      --font-size-lg
              );
              font-weight: normal;
              text-transform: uppercase;
              line-height: 0.875em;
            }
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="nav-button__container">
    <div @click="showMenu" class="menu__btn" :class="{ 'active': data.state }">
      <p>✚</p>
    </div>
    <DropMenu @click="handleClick" :state="data.state" :items="data.menuItems"/>
  </div>
</template>
<script>
import {reactive} from 'vue'
import DropMenu from './DropMenu.vue'
import {useRoute} from 'vue-router';
import {onMounted} from "@vue/runtime-core";

export default {
  name: "NavButton",
  emits: ["menu"],
  components: {
    DropMenu
  },
  setup(props, {emit}) {
    const route = useRoute()
    const data = reactive({
      state: false,
      clicked: null,
      menuItems: ["Add Play"]
    })

    onMounted(() => {
      if (!localStorage.getItem("user")) return;
      let user = JSON.parse(localStorage.getItem("user"))
      if (user.role === 1) {
        (route.path === "/") ? data.menuItems = [...data.menuItems, "View About", "Users"] :
            data.menuItems = ["Add User",]
      }
    })

    const showMenu = () => {
      data.state = !data.state
    }

    const handleClick = (d) => {
      data.clicked = d
      data.state = false
      emit('menu', d)
    }

    return {
      showMenu,
      handleClick,
      data
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-button__container {
  position: relative;
  z-index: 60;

  .menu__btn {
    font-size: var(--font-size-lg);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: var(--black-color);
    color: var(--primary-color);
    user-select: none;

    &:hover,
    &.active {
      background-color: #fff;
      color: var(--primary-color);
    }
  }
}
</style>
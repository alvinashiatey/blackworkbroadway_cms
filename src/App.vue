<template>
  <router-view />
</template>

<script>
import EventBus from "@/Common/EventBus";
import {useRouter} from 'vue-router';
import {onMounted, onBeforeUnmount} from "@vue/runtime-core";

export default {
  name: 'App',

  setup(){
    const router = useRouter();
    const logOut = ()=>{
      router.push({name: "Login"});
      localStorage.removeItem("user");
    }

    onMounted(()=>{
      EventBus.on("logout", ()=>{
        logOut();
      })
    })

    onBeforeUnmount(()=>{
      EventBus.remove("logout")
      EventBus.remove("users")
    })

    return {
      logOut,
    }
  }

}
</script>

<style>
</style>

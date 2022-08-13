<template>
  <div v-if="content.show" class="alert__box">
    <div  class="alert__message">
      <p>{{content.message}}</p>
    </div>
  </div>
</template>

<script>
import {onMounted} from "@vue/runtime-core";

export default {
  name: "AlertBox",
  props: ["content"],
  setup(props){
    onMounted(()=>{
      if (localStorage.getItem("showAlert") && localStorage.alert !== ""){
        props.content.show = Boolean(localStorage.getItem("showAlert"))
        props.content.message = localStorage.getItem("alert")
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.alert__box{
  background: rgba(255, 99, 71, 0.91);
  width: 30%;
  position: absolute;
  right: 5rem;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 0.25rem;
  text-align: center;
}
</style>
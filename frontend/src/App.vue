<template>
  <div>
    <navbarComponent></navbarComponent>
    <router-view></router-view>
    <toastComponent></toastComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import navbarComponent from "./components/navbar/navbar.vue";
import toastComponent from "./components/toast/toast.vue";

export default defineComponent({
  components: { navbarComponent, toastComponent },
  name: "App"
});
</script>

<style>
#app {
  margin-top: -8px;
}
</style>

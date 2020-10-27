<template>
  <div>
    <navbarComponent></navbarComponent>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import navbarComponent from "./components/navbar/navbar.vue";

export default defineComponent({
  components: { navbarComponent },
  name: "App"
});
</script>

<style>
#app {
  margin-top: -8px;
}
</style>

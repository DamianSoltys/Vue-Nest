<template>
  <router-view></router-view>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "guestPage.style.scss";
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState, StoreActions } from "../../store/store.interface";
import LoginComponent from "../../components/loginForm/loginForm.vue";
import RegisterComponent from "../../components/registerForm/registerForm.vue";

export default defineComponent({});
</script>


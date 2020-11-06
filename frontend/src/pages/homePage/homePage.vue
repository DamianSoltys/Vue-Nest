<template>
  <div class="home-page-container d-flex justify-content-center mt-5">
    <p>
      Witam, na stronie głównej, w tej aplikacji będziesz mógł zapisać swoje
      hasła oraz je podejrzeć.
    </p>
    <p>Główne hasło jak i hasła w portfelu są szyfrowane.</p>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "homePage.style.scss";
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState } from "../../store/store.interface";

export default defineComponent({});
</script>


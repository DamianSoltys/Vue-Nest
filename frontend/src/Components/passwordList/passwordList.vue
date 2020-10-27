<template>
  <div>
    <div v-for="password of state.passwords" :key="password.id">
      {{ password.webAddress }}
    </div>

    <button @click="tt()">cc</button>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "passwordList.style.scss";
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState, StoreActions } from "../../store/store.interface";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const storeState: IInitalState = store.state;
    const state = reactive({
      passwords: computed(() => storeState.passwords)
    });

    onMounted(() => {
      store.dispatch(StoreActions.GET_PASSWORDS);
    });

    function tt() {
      console.log(state.passwords);
    }
    return { state, tt };
  }
});
</script>


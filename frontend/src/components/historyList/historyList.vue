<template>
  <div class="d-flex mt-2">
    <div class="container">
      <div
        class="row m-2 align-items-center"
        v-for="history of state.history"
        :key="history.id"
      >
        <div class="col-sm">
          {{ history.id }}
        </div>
        <div class="col-sm">
          {{ history.functionType }}
        </div>
        <div class="col-sm">
          {{ new Date(history.initializeDate).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "historyList.style.scss";
</style>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import {
  IInitalState,
  StoreActions,
  SiteModeEnum,
} from "../../store/store.interface";
import { Tooltip } from "bootstrap";
import router from "../../router/router";
import {
  IDecryptPasswordData,
  IPasswordData,
  ISharePasswordData,
} from "../../interfaces/password.interface";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const storeState: IInitalState = store.state;
    const state = reactive({
      history: computed(() => storeState.history),
    });

    onMounted(() => {
      store.dispatch(StoreActions.GET_HISTORY);
    });

    return {
      state,
      SiteModeEnum,
    };
  },
});
</script>


<template>
  <div class="toast-container">
    <div
      class="toast d-flex align-items-center text-white border-0"
      v-bind:class="{
        'bg-success': state.type === IResponseType.SUCCESS,
        'bg-danger': state.type === IResponseType.ERROR,
      }"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      id="toast"
    >
      <div class="toast-body">
        {{ state.message }}
      </div>
      <button
        type="button"
        class="btn-close btn-close-white ml-auto mr-2"
        data-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "toast.style.scss";
</style>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
import { useStore } from "vuex";
import { IInitalState, StoreActions } from "../../store/store.interface";
import { Toast } from "bootstrap";
import { IResponseType } from "../../interfaces/error.interface";

export default defineComponent({
  setup() {
    const store = useStore();
    const state = reactive({
      unsubscribe: () => {},
      message: "",
      type: "",
    });

    onMounted(() => {
      const toastElement = document.getElementById("toast") as Element;
      const toast: any = new Toast(toastElement);

      state.unsubscribe = store.subscribeAction((action, storeState) => {
        if (
          action.type === StoreActions.RESPONSE_SUCCESS ||
          action.type === StoreActions.RESPONSE_ERROR
        ) {
          toast.hide();
          state.type = action.type.split("_").pop() as string;
          state.message = action.payload;
          toast.show();
        }
      });
    });

    onUnmounted(() => {
      state.unsubscribe();
    });

    return { state, IResponseType };
  },
});
</script>
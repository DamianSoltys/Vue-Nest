<template>
  <div class="d-flex mt-2">
    <div class="container">
      <div
        class="row m-2"
        v-for="password of state.passwords"
        :key="password.id"
      >
        <div class="col-sm">
          {{ password.id }}
        </div>
        <div class="col-sm">
          {{ password.login }}
        </div>
        <div class="col-sm">
          {{ password.webAddress }}
        </div>
        <div class="col-sm">
          {{ "*********" }}
        </div>
        <div class="col-sm">
          <button
            class="btn btn-primary w-100"
            @click="showDecryptedPassword(password.id)"
          >
            cc
          </button>
        </div>
      </div>
    </div>
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

    function showDecryptedPassword(passwordId: string) {
      store.dispatch(StoreActions.DECRYPT_PASSWORD, passwordId).then(data => {
        console.log(data);
      });
    }

    return { state, showDecryptedPassword };
  }
});
</script>


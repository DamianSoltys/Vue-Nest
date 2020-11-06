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
          {{ password.password ? password.password : "*********" }}
        </div>
        <div class="col-sm">
          <button
            class="btn btn-primary w-100"
            @click="showDecryptedPassword(password.id)"
          >
            {{ password.password ? "Ukryj" : "Zobacz" }}
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

    function getDecrytedData(passwordId: number) {
      store.dispatch(StoreActions.DECRYPT_PASSWORD, passwordId).then(data => {
        if (data) {
          state.passwords.map(password => {
            if (password.id === passwordId) {
              return (password.password = data);
            } else {
              return (password.password = null);
            }
          });
        }
      });
    }

    function showDecryptedPassword(passwordId: number) {
      const isDecrypted = state.passwords.find(
        password => password.id == passwordId && password.password
      );

      isDecrypted ? (isDecrypted.password = null) : getDecrytedData(passwordId);
    }

    return { state, showDecryptedPassword };
  }
});
</script>


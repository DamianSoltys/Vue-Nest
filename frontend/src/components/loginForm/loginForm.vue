<template>
  <div>
    <form>
      <div class="form-section m-2">
        <label class="form-label" for="login">Login:</label>
        <input
          type="text"
          class="form-control"
          name="login"
          v-model="form.username"
        />
      </div>
      <div class="form-section m-2">
        <label class="form-label" for="password">Hasło:</label>
        <input
          type="password"
          class="form-control"
          name="password"
          v-model="form.password"
        />
      </div>
      <div>
        <button class="btn btn-primary w-100" @click.prevent="handleSubmit()">
          Zaloguj
        </button>
        <button
          v-if="state.isBlocked"
          class="btn btn-primary w-100 mt-2"
          @click.prevent="handleUnblock()"
        >
          Odblokuj adres
        </button>
      </div>
    </form>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "loginForm.style.scss";
</style>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, onUnmounted } from "vue";
import { useStore } from "vuex";
import { IInitalState, StoreActions } from "../../store/store.interface";

export default defineComponent({
  setup() {
    const store = useStore();
    const state = reactive({
      unsubscribe: () => {},
      isBlocked: false,
    });
    const form = reactive({
      username: "",
      password: "",
    });

    state.unsubscribe = store.subscribeAction((action, storeState) => {
      if (action.type === StoreActions.TOGGLE_UNBLOCK_BUTTON) {
        console.log("test");
        state.isBlocked = action?.payload;
      }
    });

    onUnmounted(() => {
      state.unsubscribe();
    });

    function handleSubmit() {
      store.dispatch(StoreActions.LOGIN_USER, form);
    }

    function handleUnblock() {
      store.dispatch(StoreActions.UNBLOCK_ACCOUNT);
    }

    return { form, handleSubmit, handleUnblock, state };
  },
});
</script>


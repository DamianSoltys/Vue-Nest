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
      <button class="btn btn-primary w-100" @click.prevent="handleSubmit()">
        Zaloguj
      </button>
    </form>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "loginForm.style.scss";
</style>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState, StoreActions } from "../../store/store.interface";

export default defineComponent({
  setup() {
    const store = useStore();
    const form = reactive({
      username: "",
      password: ""
    });

    function handleSubmit() {
      store.dispatch(StoreActions.LOGIN_USER, form);
    }

    return { form, handleSubmit };
  }
});
</script>


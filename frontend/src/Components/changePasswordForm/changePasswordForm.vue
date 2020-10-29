<template>
  <div>
    <form>
      <div class="form-section m-2">
        <label class="form-label" for="oldPassword">Aktualne hasło:</label>
        <input
          type="password"
          class="form-control"
          name="oldPassword"
          v-model="form.oldPassword"
        />
      </div>
      <div class="form-section m-2">
        <label class="form-label" for="password">Nowe hasło:</label>
        <input
          type="password"
          class="form-control"
          name="password"
          v-model="form.password"
        />
      </div>
      <div class="form-section m-2">
        <label class="form-label" for="confirmPassword">Potwierdz hasło:</label>
        <input
          type="password"
          class="form-control"
          name="confirmPassword"
          v-model="form.confirmPassword"
        />
      </div>
      <button class="btn btn-primary w-100" @click.prevent="handleSubmit()">
        Zmień hasło
      </button>
    </form>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "changePasswordForm.style.scss";
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IChangePasswordData } from "../../interfaces/password.interface";
import { IInitalState, StoreActions } from "../../store/store.interface";

export default defineComponent({
  setup() {
    const store = useStore();
    const state = reactive({
      userId: computed(() => store.state.userId)
    });
    const form = reactive({
      password: "",
      oldPassword: "",
      confirmPassword: ""
    });

    function handleSubmit() {
      const data: IChangePasswordData = {
        password: form.password,
        oldPassword: form.oldPassword,
        userId: state.userId
      };

      store.dispatch(StoreActions.CHANGE_PASSWORD, data);
    }

    return { form, handleSubmit };
  }
});
</script>


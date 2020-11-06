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
      <div class="form-section m-2">
        <label class="form-check-label m-2" for="algorithmTypeOne">HMAC</label>
        <input
          type="radio"
          class="form-check-input m-2"
          name="algorithmTypeOne"
          v-model="form.algorithmType"
          value="HMAC"
        />
        <label class="form-check-label m-2" for="algorithmTypeTwo"
          >SHA512</label
        >
        <input
          type="radio"
          class="form-check-input m-2"
          name="algorithmTypeTwo"
          v-model="form.algorithmType"
          value="SHA512"
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
      confirmPassword: "",
      algorithmType: "HMAC"
    });

    function handleSubmit() {
      const data: IChangePasswordData = {
        password: form.password,
        oldPassword: form.oldPassword,
        userId: state.userId,
        algorithmType: form.algorithmType
      };

      store.dispatch(StoreActions.CHANGE_PASSWORD, data);
    }

    return { form, handleSubmit };
  }
});
</script>


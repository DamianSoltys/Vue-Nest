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
          type="text"
          class="form-control"
          name="password"
          v-model="form.password"
        />
      </div>
      <div class="form-section m-2">
        <label class="form-label" for="passwordConfirm">Potwierdź hasło:</label>
        <input
          type="text"
          class="form-control"
          name="passwordConfirm"
          v-model="form.passwordConfirm"
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
        Zarejestruj
      </button>
    </form>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "RegisterForm.style.scss";
</style>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState } from "../../store/store.interface";

export default defineComponent({
  props: {
    data: String
  },
  setup(props, { emit }) {
    const store = useStore();
    const form = reactive({
      username: "",
      password: "",
      passwordConfirm: "",
      algorithmType: "HMAC"
    });

    const storeState: IInitalState = store.state;
    const state = reactive({
      data: 0
    });

    function handleClick() {
      state.data += 1;
    }

    function handleSubmit() {
      const data = {
        username: form.username,
        password: form.password,
        algorithmType: form.algorithmType
      };

      emit("submit-form", data);
    }

    return { form, state, handleClick, handleSubmit };
  }
});
</script>


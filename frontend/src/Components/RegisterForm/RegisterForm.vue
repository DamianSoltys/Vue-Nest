<template>
  <div class="container">
    <form>
      <div class="form-section">
        <label for="login">Login:</label>
        <input type="text" name="login" v-model="form.login" />
      </div>
      <div class="form-section">
        <label for="password">Hasło:</label>
        <input type="text" name="password" v-model="form.password" />
      </div>
      <div class="form-section">
        <label for="passwordConfirm">Potwierdź hasło:</label>
        <input
          type="text"
          name="passwordConfirm"
          v-model="form.passwordConfirm"
        />
      </div>
      <div class="form-section">
        <label for="algorithmTypeOne">HMAC</label>
        <input
          type="radio"
          name="algorithmTypeOne"
          v-model="form.algorithmType"
          value="HMAC"
        />
        <label for="algorithmTypeTwo">SHA512</label>
        <input
          type="radio"
          name="algorithmTypeTwo"
          v-model="form.algorithmType"
          value="SHA512"
        />
      </div>
      <button @click.prevent="handleSubmit()">Test</button>
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
      login: "",
      password: "",
      passwordConfirm: "",
      algorithmType: "HMAC"
    });

    const storeState: IInitalState = store.state;
    const state = reactive({
      data: 0
    });

    onMounted(() => {
      store.dispatch("increment");
    });

    function handleClick() {
      state.data += 1;
    }

    function handleSubmit() {
      emit("submitForm", form);
    }

    return { form, state, handleClick, handleSubmit };
  }
});
</script>


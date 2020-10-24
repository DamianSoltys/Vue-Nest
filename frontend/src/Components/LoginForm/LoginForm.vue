<template>
  <div>
    <form>
      <div class="form-section m-2">
        <label class="form-label" for="login">Login:</label>
        <input type="text" class="form-control" name="login" v-model="form.login" />
      </div>
      <div class="form-section m-2">
        <label class="form-label" for="password">Hasło:</label>
        <input type="text" class="form-control" name="password" v-model="form.password" />
      </div>
      <button class="btn btn-primary w-100" @click.prevent="handleSubmit()">Zaloguj</button>
    </form>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "LoginForm.style.scss";
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
    });

    const storeState: IInitalState = store.state;
    const state = reactive({
      data: 0
    });

    function handleClick() {
      state.data += 1;
    }

    function handleSubmit() {
      emit("submit-form", form);
    }

    return { form, state, handleClick, handleSubmit };
  }
});
</script>


<template>
  <div>
    <form>
      <div class="form-section m-2">
        <label class="form-label" for="login">Login:</label>
        <input
          type="text"
          class="form-control"
          name="login"
          v-model="form.login"
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
      <div class="form-section m-2">
        <label class="form-label" for="webAddress">Adres strony:</label>
        <input
          type="text"
          class="form-control"
          name="webAddress"
          v-model="form.webAddress"
        />
      </div>
      <div class="form-section m-2">
        <label class="form-label" for="description">Opis:</label>
        <input
          type="text"
          class="form-control"
          name="description"
          v-model="form.description"
        />
      </div>
      <button class="btn btn-primary w-100" @click.prevent="handleSubmit()">
        Dodaj hasło
      </button>
    </form>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "passwordForm.style.scss";
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState } from "../../store/store.interface";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const form = reactive({
      webAddress: "",
      login: "",
      password: "",
      description: ""
    });

    const storeState: IInitalState = store.state;
    const state = reactive({
      username: computed(() => storeState.username)
    });

    function handleSubmit() {
      const data = { ...form, username: state.username };

      emit("submit-form", data);
    }

    return { form, state, handleSubmit };
  }
});
</script>


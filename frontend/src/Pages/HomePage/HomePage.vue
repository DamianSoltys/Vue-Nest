<template>
  <div>
    <div class="row">
      <nav class="bg-light d-flex justify-content-between">
        <div>
          <span class="logo-text"> BSI Locker App </span>
        </div>

        <div>
          <div v-if="!state.logged">
            <button @click="loginForm = true" class="btn btn-primary m-1">
              Login
            </button>
            <button @click="loginForm = false" class="btn btn-primary m-1">
              Register
            </button>
          </div>
          <div v-if="state.logged">
            <button @click="logout()" class="btn btn-primary m-1">
              Wyloguj
            </button>
            <span class="m-5">{{ state.username }}</span>
          </div>
        </div>
      </nav>
    </div>

    <div class="d-flex justify-content-center" v-if="!state.logged">
      <RegisterForm
        v-if="!loginForm"
        @submit-form="handleSubmit($event)"
      ></RegisterForm>

      <LoginForm
        v-if="loginForm"
        @submit-form="handleSubmit($event)"
      ></LoginForm>
    </div>

    <div class="d-flex justify-content-center" v-if="state.logged">
      Zalogowany
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "HomePage.style.scss";
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState } from "../../store/store.interface";
import RegisterForm from "../../components/registerForm/registerForm.vue";
import LoginForm from "../../components/loginForm/loginForm.vue";

export default defineComponent({
  components: { RegisterForm, LoginForm },
  props: {
    data: String
  },
  setup(props, context) {
    const store = useStore();
    const loginForm = ref(true);

    const storeState: IInitalState = reactive(store.state);
    const state = reactive({
      data: 0,
      logged: computed(() => storeState.logged),
      username: computed(() => storeState.username)
    });

    onMounted(() => {
      console.log(state);
    });

    function logout() {
      store.dispatch("LOGOUT_USER").then(data => {
        console.log(data);
      });
    }

    function handleSubmit(formData: {}) {
      if (loginForm.value) {
        store.dispatch("LOGIN_USER", formData).then(data => {
          console.log(data, state);
        });
      } else {
        store.dispatch("REGISTER_USER", formData).then(data => {
          console.log(data);
        });
      }
    }

    return { state, handleSubmit, loginForm, logout };
  }
});
</script>


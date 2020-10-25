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
      <p>
        <button
          class="btn btn-primary"
          data-toggle="collapse"
          href="#passwordForm"
          role="button"
          aria-expanded="false"
          aria-controls="passwordForm"
        >
          Toggle first element
        </button>
        <button
          class="btn btn-primary"
          data-toggle="collapse"
          data-target="#passwordList"
          aria-expanded="false"
          aria-controls="passwordList"
        >
          Toggle second element
        </button>
      </p>
      <div class="row">
        <div class="col">
          <div class="collapse multi-collapse" id="passwordForm">
            <div class="card card-body">
              <PasswordForm @submit-form="addPassword($event)"></PasswordForm>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="collapse multi-collapse" id="passwordList">
            <div class="card card-body">
              <PasswordList></PasswordList>
            </div>
          </div>
        </div>
      </div>
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
import PasswordForm from "../../components/passwordForm/passwordForm.vue";
import PasswordList from "../../components/passwordList/passwordList.vue";

export default defineComponent({
  components: { RegisterForm, LoginForm, PasswordForm, PasswordList },
  setup() {
    const store = useStore();
    const loginForm = ref(true);

    const storeState: IInitalState = store.state;
    const state = reactive({
      data: 0,
      logged: computed(() => storeState.logged),
      username: computed(() => storeState.username)
    });

    onMounted(() => {
      store.dispatch("CHECK_AUTH");
    });

    function logout() {
      store.dispatch("LOGOUT_USER");
    }

    function addPassword(formData: {}) {
      console.log(formData);
    }

    function handleSubmit(formData: {}) {
      if (loginForm.value) {
        store.dispatch("LOGIN_USER", formData);
      } else {
        store.dispatch("REGISTER_USER", formData);
      }
    }

    return { state, addPassword, handleSubmit, loginForm, logout };
  }
});
</script>


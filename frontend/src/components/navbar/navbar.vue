<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">BSI Locker App</a>
    <div
      class="collapse navbar-collapse ml-5 navbar-container justify-content-between"
      id="navbarNavAltMarkup"
    >
      <div class="navbar-nav">
        <template v-if="!state.logged">
          <li class="nav-item">
            <router-link class="nav-link" to="/guest/login"
              >Logowanie</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/guest/register"
              >Rejestracja</router-link
            >
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <router-link class="nav-link" to="/password/password-list"
              >Zobacz hasła</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/password/new-password"
              >Dodaj hasło</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/user/change-password"
              >Zmień hasło</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="logout()">
              Wyloguj
            </router-link>
          </li>
        </template>
      </div>
      <div v-if="state.logged">
        <router-link class="navbar-brand" to="/home"
          >Użytkownik: {{ state.username }}</router-link
        >
        <div class="mt-2">
          <p>Ostanie logowanie: {{ state.lastSuccessLogin }}</p>
          <p>
            Ostania próba logowania:
            {{ state.lastFailureLogin || "Brak danych" }}
          </p>
        </div>
      </div>
    </div>
  </nav>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "navbar.style.scss";
</style>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState, StoreActions } from "../../store/store.interface";

export default defineComponent({
  setup() {
    const store = useStore();
    const loginForm = ref(true);

    const storeState: IInitalState = store.state;
    const state = reactive({
      list: true,
      logged: computed(() => storeState.logged),
      username: computed(() => storeState.username),
      lastFailureLogin: computed(() => storeState.lastFailureLogin),
      lastSuccessLogin: computed(() => storeState.lastSuccessLogin),
    });

    onMounted(() => {
      store.dispatch(StoreActions.CHECK_AUTH);
    });

    function logout() {
      store.dispatch(StoreActions.LOGOUT_USER);
    }

    return { state, loginForm, logout };
  },
});
</script>


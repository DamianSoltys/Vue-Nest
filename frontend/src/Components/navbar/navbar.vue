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
      <router-link class="navbar-brand" v-if="state.logged" to="/home">{{
        state.username
      }}</router-link>
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
      username: computed(() => storeState.username)
    });

    onMounted(() => {
      store.dispatch(StoreActions.CHECK_AUTH);
    });

    function logout() {
      store.dispatch(StoreActions.LOGOUT_USER);
    }

    return { state, loginForm, logout };
  }
});
</script>


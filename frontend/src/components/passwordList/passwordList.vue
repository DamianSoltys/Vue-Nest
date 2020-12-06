<template>
  <div class="d-flex mt-2">
    <div class="container">
      <div
        class="row m-2 align-items-center"
        v-for="password of state.passwords"
        :key="password.id"
      >
        <div class="col-sm">
          {{ password.id }}
        </div>
        <div class="col-sm">
          {{ password.login }}
        </div>
        <div class="col-sm">
          {{ password.webAddress }}
        </div>
        <div class="col-sm">
          {{ password.password ? password.password : "*********" }}
        </div>
        <div class="col-sm d-flex">
          <button
            class="btn btn-primary w-100 m-2"
            @click="showDecryptedPassword(password.id)"
          >
            {{ password.password ? "Ukryj" : "Zobacz" }}
          </button>
          <span
            class="m-2"
            data-toggle="tooltip"
            data-placement="bottom"
            :title="
              state.mode === SiteModeEnum.READONLY
                ? 'Zmień tryb strony aby użyć tej funkcji'
                : 'Edytuj dane'
            "
          >
            <button
              :disabled="state.mode === SiteModeEnum.READONLY"
              class="btn btn-primary w-100"
              @click="editPassword(password)"
            >
              Edytuj
            </button>
          </span>
          <span
            class="m-2"
            data-toggle="tooltip"
            data-placement="bottom"
            :title="
              state.mode === SiteModeEnum.READONLY
                ? 'Zmień tryb strony aby użyć tej funkcji'
                : 'Udostępnij'
            "
          >
            <button
              data-toggle="modal"
              data-target="#exampleModal"
              :disabled="state.mode === SiteModeEnum.READONLY"
              @click="state.sharePasssword = password"
              class="btn btn-primary w-100"
            >
              Udostępnij
            </button>
          </span>
          <span
            class="m-2"
            data-toggle="tooltip"
            data-placement="bottom"
            :title="
              state.mode === SiteModeEnum.READONLY
                ? 'Zmień tryb strony aby użyć tej funkcji'
                : 'Usuń dane'
            "
          >
            <button
              :disabled="state.mode === SiteModeEnum.READONLY"
              class="btn btn-primary w-100"
              @click="deletePassword(password.id)"
            >
              Usuń
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Udostępnij swoje hasło
            </h5>
            <button
              type="button"
              class="btn-close"
              data-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-section m-2">
                <label class="form-label" for="email">Email użytkownika:</label>
                <input
                  type="text"
                  class="form-control"
                  name="email"
                  v-model="form.email"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Anuluj
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="sharePassword(form.email)"
            >
              Udostępnij hasło
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "passwordList.style.scss";
</style>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import {
  IInitalState,
  StoreActions,
  SiteModeEnum,
} from "../../store/store.interface";
import { Tooltip } from "bootstrap";
import router from "../../router/router";
import { IPasswordData } from "../../interfaces/password.interface";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const storeState: IInitalState = store.state;
    const state = reactive({
      passwords: computed(() => storeState.passwords),
      mode: computed(() => storeState.mode),
      editData: computed(() => storeState.editData),
      sharePasssword: null,
      tooltips: [] as Tooltip[],
    });
    const form = reactive({
      email: "",
    });

    function setTooltips() {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-toggle="tooltip"]')
      );
      state.tooltips = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl);
      });
    }

    onMounted(() => {
      store.dispatch(StoreActions.GET_PASSWORDS);
    });

    onUpdated(() => {
      setTooltips();
    });

    function getDecrytedData(passwordId: number) {
      store.dispatch(StoreActions.DECRYPT_PASSWORD, passwordId).then((data) => {
        if (data) {
          state.passwords.map((password) => {
            if (password.id === passwordId) {
              return (password.password = data);
            } else {
              return (password.password = null);
            }
          });
        }
      });
    }

    function deletePassword(id: number) {
      state.tooltips.forEach((tooltip) => {
        tooltip.hide();
      });
      store.dispatch(StoreActions.DELETE_PASSWORD, id);
    }

    function editPassword(password: IPasswordData) {
      state.tooltips.forEach((tooltip) => {
        tooltip.hide();
      });
      store.dispatch(StoreActions.SET_MODIFY_PASSWORD, password);
    }

    function sharePassword(email: string) {
      state.tooltips.forEach((tooltip) => {
        tooltip.hide();
      });
      console.log(email);
      console.log(state.sharePasssword);
    }

    function showDecryptedPassword(passwordId: number) {
      const isDecrypted = state.passwords.find(
        (password) => password.id == passwordId && password.password
      );

      isDecrypted ? (isDecrypted.password = null) : getDecrytedData(passwordId);
    }

    return {
      form,
      state,
      showDecryptedPassword,
      deletePassword,
      editPassword,
      sharePassword,
      SiteModeEnum,
    };
  },
});
</script>


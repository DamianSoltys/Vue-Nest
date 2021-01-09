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
            @click="
              showDecryptedPassword({
                passwordId: password.id,
                userId: password.userId,
              })
            "
          >
            {{ password.password ? "Ukryj" : "Zobacz" }}
          </button>
          <span
            v-if="password.isOwner"
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
            v-if="password.isOwner"
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
              @click="setSharePassword(password)"
              class="btn btn-primary w-100"
            >
              Udostępnij
            </button>
          </span>
          <span
            v-if="password.isOwner"
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
          <div class="btn-group w-100 m-2 change-dropdown">
            <button type="button" class="btn btn-primary" @click="getChanges(password.id)">Zobacz historię</button>
            <button v-if="state.actualPasswordDataId === password.id" type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" :disabled="!state.dataChanges.length"></button>
            <ul class="dropdown-menu">
              <li v-for="dataChanges of state.dataChanges" :key="dataChanges.id">
                <a class="dropdown-item">
                  <p>id: {{dataChanges.id}}</p>
                  <p>typ: {{dataChanges.functionType}}</p>
                  <p class="json-data">dane: {{dataChanges.previousValue}}</p>
                </a>
              </li>
            </ul>
          </div>
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
                <label class="form-label" for="username"
                  >Nazwa użytkownika:</label
                >
                <input
                  type="text"
                  class="form-control"
                  name="username"
                  v-model="form.username"
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
              @click="sharePassword(form.username)"
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
import { Dropdown, Tooltip } from "bootstrap";
import router from "../../router/router";
import {
  IDecryptPasswordData,
  IPasswordData,
  ISharePasswordData,
} from "../../interfaces/password.interface";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const storeState: IInitalState = store.state;
    const state = reactive({
      passwords: computed(() => storeState.passwords),
      mode: computed(() => storeState.mode),
      editData: computed(() => storeState.editData),
      dataChanges: computed(() => storeState.dataChanges),
      sharePassword: {} as IPasswordData,
      tooltips: [] as Tooltip[],
      dropdowns: [] as Dropdown[],
      actualPasswordDataId:-1,
    });
    const form = reactive({
      username: "",
    });

    function setTooltips() {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-toggle="tooltip"]')
      );
      state.tooltips = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl);
      });
    }

    function setDropdowns() {
      const dropdownTriggerList = [].slice.call(
        document.querySelectorAll('.dropdown-toggle')
      );
      state.dropdowns = dropdownTriggerList.map(function (dropdownTriggerEl) {
        return new Dropdown(dropdownTriggerEl);
      });
    }

    onMounted(() => {
      store.dispatch(StoreActions.GET_PASSWORDS);
    });

    onUpdated(() => {
      setTooltips();
      setDropdowns();
      console.log(state)
    });

    function getChanges(recordId: number) {
      store.dispatch(StoreActions.GET_CHANGES, recordId);
      state.actualPasswordDataId = recordId;
    }

    function getDecrytedData({ passwordId, userId }: IDecryptPasswordData) {
      store
        .dispatch(StoreActions.DECRYPT_PASSWORD, { passwordId, userId })
        .then((data) => {
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
      // TODO refactor - must be a better way to do this
      state.tooltips.forEach((tooltip) => {
        tooltip.hide();
      });
      store.dispatch(StoreActions.DELETE_PASSWORD, id);
    }

    function editPassword(password: IPasswordData) {
      // TODO refactor - must be a better way to do this
      state.tooltips.forEach((tooltip) => {
        tooltip.hide();
      });
      store.dispatch(StoreActions.SET_MODIFY_PASSWORD, password);
    }

    function sharePassword(username: string) {
      const passwordData: ISharePasswordData = {
        username,
        passwordId: state.sharePassword.id || 0,
      };
      // TODO refactor - must be a better way to do this
      state.tooltips.forEach((tooltip) => {
        tooltip.hide();
      });
      store.dispatch(StoreActions.SHARE_PASSWORD, passwordData);
    }

    function showDecryptedPassword(decryptData: IDecryptPasswordData) {
      const isDecrypted = state.passwords.find(
        (password) => password.id == decryptData.passwordId && password.password
      );

      isDecrypted
        ? (isDecrypted.password = null)
        : getDecrytedData(decryptData);
    }

    function setSharePassword(password: IPasswordData) {
      state.sharePassword = password;
    }

    return {
      form,
      state,
      setSharePassword,
      showDecryptedPassword,
      deletePassword,
      editPassword,
      sharePassword,
      getChanges,
      SiteModeEnum,
    };
  },
});
</script>


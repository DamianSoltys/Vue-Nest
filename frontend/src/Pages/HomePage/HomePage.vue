<template>
  <div class="container">
    <RegisterForm
      v-if="!loginForm"
      @submit-form="handleSubmit($event)"
    ></RegisterForm>
    <LoginForm v-if="loginForm" @submit-form="handleSubmit($event)"></LoginForm>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "HomePage.style.scss";
</style>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState } from "../../store/store.interface";
import RegisterForm from "../../Components/RegisterForm/RegisterForm.vue";
import LoginForm from "../../Components/LoginForm/LoginForm.vue";

export default defineComponent({
  components: { RegisterForm, LoginForm },
  props: {
    data: String
  },
  setup(props, context) {
    const store = useStore();
    const loginForm = ref(true);
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

    function handleSubmit(formData: {}) {
      console.log(formData);
    }

    return { form, state, handleClick, handleSubmit, loginForm };
  }
});
</script>


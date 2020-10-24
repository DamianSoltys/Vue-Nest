<template>
  <div>
    <div class="row">
      <nav class="bg-light d-flex justify-content-between">
        <div>
         <span class="logo-text"> BSI Locker App </span>
        </div>

        <div>
          <button @click="loginForm = true" class="btn btn-primary m-1">Login</button>
          <button @click="loginForm = false" class="btn btn-primary m-1">Register</button>
          <span class="m-5">Nazwa</span>
        </div>
      </nav>
    </div>

    <div class="d-flex justify-content-center"> 
      <RegisterForm
        v-if="!loginForm"
        @submit-form="handleSubmit($event)"
      ></RegisterForm>
      
      <LoginForm 
        v-if="loginForm" 
        @submit-form="handleSubmit($event)"
      ></LoginForm>
    </div>
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
import RegisterForm from "../../components/RegisterForm/RegisterForm.vue";
import LoginForm from "../../components/LoginForm/LoginForm.vue";

export default defineComponent({
  components: { RegisterForm, LoginForm },
  props: {
    data: String
  },
  setup(props, context) {
    const store = useStore();
    const loginForm = ref(true);

    const storeState: IInitalState = store.state;
    const state = reactive({
      data: 0
    });

    onMounted(() => {
     console.log('test');
    });

    function handleClick() {
      state.data += 1;
    }

    function handleSubmit(formData: {}) {
      if(loginForm.value) {
        store.dispatch('LOGIN_USER',formData).then(data=>{
          console.log(data);
        });
      } else {
        store.dispatch('REGISTER_USER',formData).then(data=>{
          console.log(data);
        });
      }
    }

    return { state, handleClick, handleSubmit, loginForm };
  }
});
</script>


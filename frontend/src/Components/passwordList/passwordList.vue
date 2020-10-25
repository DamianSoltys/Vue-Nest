<template>
  <div>
    list
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "passwordList.style.scss";
</style>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { IInitalState } from "../../store/store.interface";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const storeState: IInitalState = store.state;
    const state = reactive({
      data: 0
    });

    return { state };
  }
});
</script>


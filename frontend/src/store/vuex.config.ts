import { createStore } from 'vuex'
import { IInitalState } from './store.interface'

export default createStore({
  state ():IInitalState {
    return {
      count: 1
    }
  },
  mutations:{
    increment(state:IInitalState,payload:number) {
      state.count=payload;
    }
  },
  actions: {
    increment({commit,state}) {
      commit('increment',state.count + 1);
    }
  }
});

import { createStore } from 'vuex';

const store = createStore({
  state: {
    key1: 1212,
  },
  mutations: {},
  actions: {},
  modules: {},
});
export type State = typeof store.state;
export default store;

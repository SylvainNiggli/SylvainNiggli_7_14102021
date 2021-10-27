import { createStore } from 'vuex';
import { auth } from './auth.module.js';
import { posts } from './posts.module.js';
export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    posts
  }
})

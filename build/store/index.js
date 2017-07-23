import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        count: 0,
        msg: 'start'
    },
    mutations: {
        increat (state, n) {
            state.count = state.count + n;
        }
    },
    getters: {
        msg (state) {
            return 'change the string count is ' + state.count;
        }
    }
});
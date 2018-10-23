import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import socket from './modules/socket';
import chat from './modules/chat';

Vue.use(Vuex);

const debug = true;// process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        user,
        socket,
        chat,
    },
    strict: debug,
})

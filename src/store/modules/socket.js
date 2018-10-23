/* eslint-disable promise/param-names */
import {START_SOCKET,} from '../actions/socket'
import io from 'socket.io-client';
import Vue from "vue";
import VueSocketio from 'vue-socket.io-extended';

const state = {
    socket: null,
    isConnected: false
};

const getters = {
    isConnected: state => state.isConnected,
};

const actions = {
    START_SOCKET({commit, dispatch}, payload) {
        const socket = io.connect('localhost:3000', payload);
        var store = this;
        Vue.use(VueSocketio, socket, {
            store,
            actionPrefix: 'SOCKET_',
            eventToActionTransformer: event => event.toUpperCase(),
        });
        commit(START_SOCKET);
    },
};

const mutations = {
    START_SOCKET(state) {
    },
    SOCKET_CONNECT(state, status) {
        state.isConnected = true;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};

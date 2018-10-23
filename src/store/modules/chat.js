/* eslint-disable promise/param-names */
import {ADD_CHAT, ADD_OLD_MESSAGES, LOAD_CHATS, SET_SHOW_OLD} from '../actions/chat'

const state = {
    token: localStorage.getItem('user-token') || '',
    my_client: null,
    status: '',
    hasLoadedOnce: false,
    chats: [],
    isConnected: false
};

const getters = {
    getChat: state => chat_id => state.chats.find(x => x.id === chat_id),
    getChats: state => state.chats,
};

const actions = {
    CREATE_CHAT({commit, dispatch}, {user_id, name}) {
        this._vm.$socket.emit('create chat', user_id, name);
    },
    OPEN_CHAT({commit, dispatch}, {chat_id}) {
        this._vm.$socket.emit('open chat', chat_id);
    },
    CLOSE_CHAT({commit, dispatch}, {chat_id}) {
        this._vm.$socket.emit('close chat', chat_id);
    },
    LOAD_OLD_MESSAGES({commit, dispatch}, {chat_id}) {
        var limit = 5;
        var chat = state.chats.find(x => x.id === chat_id);
        var message_id = chat.messages.length > 0 ? chat.messages[0].id : null;

        this._vm.$socket.emit(
            'load old messages',
            chat_id,
            message_id,
            limit,
            function (messages, show_old) {
                commit(ADD_OLD_MESSAGES, {chat_id, messages});
                commit(SET_SHOW_OLD, {chat_id, show_old});
            });
    },
    SEND_MESSAGE({commit, dispatch}, {chat_id, message}) {
        this._vm.$socket.emit('send message', chat_id, message);
    },
    //SOCKET ACTIONS
    SOCKET_CONNECT({commit, dispatch}) {
        this._vm.$socket.emit('load chats', function (chats) {
            commit(LOAD_CHATS, chats);
        });
    },
    SOCKET_ACTIVATE_CHAT({commit, dispatch, state}, chat_id) {
        if (!state.chats.find(x => x.id === chat_id)) {
            this._vm.$socket.emit('load chat', chat_id, function (chat) {
                commit(ADD_CHAT, {chat});
            });
        }
    },
};

const mutations = {
    [LOAD_CHATS]: (state, chats) => {
        state.chats = chats;
    },
    [ADD_CHAT]: (state, {chat}) => {
        state.chats = [...state.chats, chat];
    },
    [ADD_OLD_MESSAGES]: (state, {chat_id, messages}) => {
        if (messages && messages.length > 0) {
            var chat = state.chats.find(x => x.id === chat_id);
            chat.messages.unshift(...messages);
        }
    },
    [SET_SHOW_OLD]: (state, {chat_id, show_old}) => {
        var chat = state.chats.find(x => x.id === chat_id);
        chat.show_old = show_old;
    },
    //Mutations from socket events
    SOCKET_CONNECT(state, status) {
    },
    SOCKET_MESSAGE_RECEIVED(state, message) {
        var chat = state.chats.find(x => x.id === message.chat_id);
        if (chat) {
            chat.messages.push(message);
        }
    },
    // SOCKET_CHAT_OPENED(state, chat) {
    //     if (!state.chats.some(x => x.id === chat.id)) {
    //         state.chats = [...chatContainer.chats, chat];
    //         state.socket.emit('join chat', chat.id);
    //     }
    // },
    SOCKET_CHAT_CLOSED(state, chat_id) {
        state.chats = state.chats.filter(function (item) {
            return item.id !== chat_id;
        });
    },
    S() {
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};

<template>
    <div class="row">
        <div class="col-sm-4">
            <user-search
                    v-on:open-chat="openChat"
                    v-on:create-chat="createChat"
            />
            <ul class="list-group">
                <li v-for="chat in chatList" class="list-group-item">
                    <a href="#" :data-id="chat.id" @click="activateChat">[ {{ chat.name }} ]</a>
                    <a href="#" :data-id="chat.id" @click="closeChat" class="pull-right"> X </a>
                </li>
            </ul>
        </div>
        <div class="col-sm-8">

            <form @submit="connectToChat" action="/" method="post" v-if="!isConnected">
                <input class="form-control" type="text" v-model="user_id" placeholder="User id">
                <input class="form-control" type="text" v-model="name" placeholder="USer name">
                <button type="submit">Connect</button>
            </form>

            <div v-else>
                <label> {{this.displayName}} </label>
                <chat
                        v-if="activeChat"
                        :id="activeChat.id"
                        :name="activeChat.name"
                        :messages="activeChat.messages"
                        :show_old="activeChat.show_old"
                />

                <div v-else>
                    <p>Choose one chat</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {SET_USER_ID} from '../store/actions/user'
    import {START_SOCKET} from '../store/actions/socket'
    import {CLOSE_CHAT, CREATE_CHAT, OPEN_CHAT} from '../store/actions/chat'
    import Chat from './Chat.vue'
    import UserSearch from './UserSearch.vue'

    export default {
        components: {
            Chat,
            UserSearch
        },
        data() {
            return {
                displayName: '',
                user_id: '',
                name: '',
                active_chat_id: null,
            }
        },
        methods: {
            connectToChat(event) {
                event.preventDefault();

                //@TODO should be extracted to mounted
                this.displayName = this.user_id + ' => ' + this.name;
                this.$store.commit(SET_USER_ID, {user_id: this.user_id});
                let query = 'user_id=' + this.user_id + '&' + 'name=' + this.name;
                this.$store.dispatch(START_SOCKET, {query: query});
            },
            createChat(user_id, name) {
                event.preventDefault();
                this.$store.dispatch(CREATE_CHAT, {user_id, name});
            },
            openChat(chat_id) {
                this.$store.dispatch(OPEN_CHAT, {chat_id});
            },
            activateChat(event) {
                event.preventDefault();
                let chat_id = event.target.getAttribute('data-id');
                this.active_chat_id = chat_id;
            },
            closeChat(event) {
                event.preventDefault();
                let chat_id = event.target.getAttribute('data-id');
                // if (this.active_chat_id === chat_id) {
                //     this.active_chat_id = null;
                // }
                this.$store.dispatch(CLOSE_CHAT, {chat_id});
            },
        },
        computed: {
            isConnected() {
                return this.$store.getters.isConnected;
            },
            activeChat() {
                if (!this.active_chat_id) {
                    return null;
                }
                var chat = this.$store.getters.getChat(this.active_chat_id);
                if (!chat) {
                    this.active_chat_id = null;
                }
                return chat;
            },
            chatList() {
                return this.$store.getters.getChats;
            }
        },
        mounted() {
        }
    }
</script>

<style>
</style>

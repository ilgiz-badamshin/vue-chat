<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3>{{name}}</h3>
        </div>
        <div class="panel-body">
            <chat-box
                    :messages="messages"
                    :show_old="show_old"
                    v-on:send-message="sendMessage"
                    v-on:load-old-messages="loadOldMessages"
            />
        </div>
    </div>
</template>

<script>
    import {LOAD_OLD_MESSAGES, SEND_MESSAGE} from '../store/actions/chat'
    import ChatBox from './ChatBox.vue'

    export default {
        components: {ChatBox},
        props: [
            'id',
            'name',
            'messages',
            'show_old',
        ],
        data() {
            return {
                user: '',
                message: '',
                // messages: [],
                // socket: io('localhost:3000')
            }
        },
        methods: {
            sendMessage(message) {
                // this.$parent.socket.emit('send message', this.id, message);
                this.$store.dispatch(SEND_MESSAGE, {chat_id: this.id, message});
            },
            loadOldMessages() {
                this.$store.dispatch(LOAD_OLD_MESSAGES, {chat_id: this.id});
            }
        },
        mounted() {
            let chat = this;

        }
    }
</script>

<style>

</style>

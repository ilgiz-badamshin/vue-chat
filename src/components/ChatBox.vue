<template xmlns="http://www.w3.org/1999/html">
    <div id="ChatBox">
        <div class="message-container">
            <div class="text-center" v-show="show_old">
                <a href="#" @click="loadOldMessages" class="btn btn-default"> Load messages </a>
            </div>

            <transition-group name="fade" tag="div">
                <chat-message
                        v-for="message in messages"
                        :data="message"
                        v-bind:key="message.id"
                ></chat-message>
            </transition-group>
        </div>

        <div class="form-group">
            <form @submit="sendMessage" action="/" method="post">
                <div class="input-group">
                    <input type="text"
                           class="form-control"
                           aria-label="With textarea"
                           v-model="newMessage"
                           placeholder="Enter your message here"
                    />
                    <span class="input-group-btn">
                            <button class="btn btn-primary" type="submit"> Send </button>
                        </span>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import ChatMessage from './ChatMessage.vue'

    export default {
        components: {ChatMessage},
        props: [
            'messages',
            'show_old',
        ],

        data() {
            return {
                newMessage: '',
                // messages: [],
                onlineUsers: []
            }
        },

        mounted() {
        },

        methods: {
            sendMessage(event) {
                event.preventDefault();

                this.$emit('send-message', this.newMessage);
                this.newMessage = ''
            },
            loadOldMessages(event) {
                event.preventDefault();

                this.$emit('load-old-messages');
            },

            kickUser(event) {
                event.preventDefault();

                // Get the username of the user we're kicking
                let usernameToKick = event.target.getAttribute('data-username')

                // Tell the server to kick them from the chat
                this.$parent.$parent.socket.emit('kick user', usernameToKick)
            }
        },

        computed: {
            // Surely there must be a better way to do this? @TODO
            isAdmin() {
                return this.$parent.isAdmin
            }
        }
    }
</script>

<style>
    .message-container {
        max-height: 100%;
        overflow-y: auto;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all 1s;
    }

    .fade-enter, .fade-leave-to /* .list-leave-active below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }
</style>
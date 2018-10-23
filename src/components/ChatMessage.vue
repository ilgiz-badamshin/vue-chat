<template>
    <div class="message" v-bind:class="[ isOwn ? 'message-out': 'message-in' ]">
        <div class="" v-if="isAlert">
            <strong>{{ data.message }}</strong>
        </div>

        <div class="" v-else>
            <p class="author">
                <strong> {{ data.user.display_name }}</strong> said,
                {{ data.created_at }}
            </p>

            <p class="details">
                {{ data.message }}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'data',
        ],

        computed: {
            isOwn() {
                return this.data.user.id === this.$store.state.user.user_id;
            },
            isAlert() {
                return this.data.type === 'alert';
            }
        }
    }
</script>

<style>
    .message:nth-child(even) {
    }

    .message:nth-child(odd) {
        background-color: #F7F7F7;
    }

    .message-in {
        text-align: left;
    }

    .message-out {
        text-align: right;
    }
</style>
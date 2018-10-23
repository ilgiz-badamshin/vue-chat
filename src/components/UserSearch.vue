<template>
    <div class="">
        <div class="form-group">
            <form action="/" method="post">
                <input class="form-control" type="text" v-model="user_id" placeholder="Chat id heere">
                <input class="form-control" type="text" v-model="name" placeholder="Name heere">
                <button type="button" @click="createChat">Create</button>
                <button type="button" @click="openChat">Open</button>
            </form>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                user_id: '',
                name: '',
            }
        },


        methods: {
            createChat(event) {
                event.preventDefault();

                this.$emit('create-chat', this.user_id, this.name);
                this.user_id = '';
                this.name = '';
            },
            openChat(event) {
                event.preventDefault();

                this.$emit('open-chat', this.user_id, this.name);
                this.user_id = '';
                this.name = '';
            },
        },

    }
</script>

<style>
</style>
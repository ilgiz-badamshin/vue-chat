<template>
    <div id="app">
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <ChatContainer/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ChatContainer from './components/ChatContainer.vue'

    export default {
        sockets:{
            connect: function(){
                console.log('socket connected')
                console.log(this.$socket);
            },
            customEmit: function(val){
                console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
            }
        },
        name: 'app',
        components: {
            ChatContainer
        }
    }
</script>

<style>

</style>

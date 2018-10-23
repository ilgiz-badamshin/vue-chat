import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

// import VueSocketio from 'vue-socket.io-extended';
// import io from 'socket.io-client';
// console.log(store);
// Vue.use(VueSocketio, io('localhost:3000'), { store });

new Vue({
    render: h => h(App),
    store,
}).$mount('#app')

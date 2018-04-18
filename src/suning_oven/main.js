if(process.env.NODE_ENV == 'development'){
    require('../../mock/oven/index.js')
}


import Vue from 'vue'
import App from './App.vue'

// Vue.component('navigator', Navigator);

new Vue({
    el: '#app',
    render: h => h(App)
});

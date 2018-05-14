if(process.env.NODE_ENV == 'development'){
    require('../../mock/water_heater/index.js')
}



import Vue from 'vue';
import App from './App.vue';

new Vue({
    el: '#app',
    render: h => h(App)
});

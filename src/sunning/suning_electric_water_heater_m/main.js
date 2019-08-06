if(process.env.NODE_ENV == 'development'){
    require('../../mock/water_heater/index.js')
}



import Vue from 'vue';
import App from './App.vue';

import '../../lib/base/electric_water_heater/index_m.less'

new Vue({
    el: '#app',
    render: h => h(App)
});

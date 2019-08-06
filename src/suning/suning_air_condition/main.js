if(process.env.NODE_ENV == 'development'){
    require('../../../mock/air_condition/index.js')
}

import Vue from 'vue';
import App from './App.vue';

import '@lib/base/air_condition/index.less'

new Vue({
    el: '#app',
    render: h => h(App)
});

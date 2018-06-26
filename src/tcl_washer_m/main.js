if(process.env.NODE_ENV == 'development'){
    require('../../mock/washer/index.js')
}

import Vue from 'vue'
import App from './App.vue'

import '../../lib/base/washer/index_m.less'

import FastClick from 'fastclick'

FastClick.attach(document.body)

new Vue({
    el: '#app',
    render: h => h(App)
});

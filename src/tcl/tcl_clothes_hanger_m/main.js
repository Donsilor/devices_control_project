if(process.env.NODE_ENV == 'development'){
    require('@mock/clothes_hanger/index.js')
}

import Vue from 'vue'
import App from './App.vue'
import Topbar from '@lib/components/Topbar.vue'

import '@lib/base/clothes_hanger/index_m.less'

import FastClick from 'fastclick'
FastClick.attach(document.body)
Vue.component('topbar', Topbar)

new Vue({
    el: '#app',
    render: h => h(App)
})

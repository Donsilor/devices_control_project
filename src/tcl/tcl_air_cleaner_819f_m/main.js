if(process.env.NODE_ENV == 'development'){
    require('@mock/air_cleaner/index.js')
}

import Vue from 'vue'
import App from './App.vue'

import '@lib/base/air_cleaner/index_m.less'
import Topbar from '@lib/components/Topbar.vue'
import store from '@lib/store/index.js'

import FastClick from 'fastclick'

FastClick.attach(document.body)
Vue.component('topbar', Topbar)

new Vue({
    el: '#app',
    store,
    render: h => h(App)
})

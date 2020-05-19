if(process.env.NODE_ENV == 'development'){
    require('@mock/washer/index.js')
}

import Vue from 'vue'
import App from './App.vue'

import '@lib/base/washer/index.less'
import Topbar from '@lib/components/Topbar.vue'

import FastClick from 'fastclick'

FastClick.attach(document.body)
Vue.component('topbar', Topbar)

new Vue({
    el: '#app',
    render: h => h(App)
})

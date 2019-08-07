if(process.env.NODE_ENV == 'development'){
    require('../../../mock/washer/index.js')
}

import Vue from 'vue'
import App from './App.vue'
import Topbar from './components/Topbar.vue'

import '@lib/base/haier_washer/index_m.less'

import FastClick from 'fastclick'
import * as filters from './filters' // global filters

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

FastClick.attach(document.body)
Vue.component('topbar', Topbar)

new Vue({
    el: '#app',
    render: h => h(App)
})

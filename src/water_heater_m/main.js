console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../mock/water_heater/index.js')
}
import Vue from 'vue'
import App from './App.vue'
import '../../lib/base/blend/index_m.less'
import FastClick from 'fastclick'
import Topbar from '../../lib/components/Topbar.vue'

Vue.component('topbar', Topbar)
FastClick.attach(document.body)
import * as filters from './filters' // global filters

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
    el: '#app',
    render: h => h(App)
})

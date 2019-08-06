if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../../mock/dehumidifier/index.js')
}

import Vue from 'vue'
import App from './App.vue'
import '@lib/base/air_cleaner/index_m.less'
// import FastClick from 'fastclick'
import Topbar from '@lib/components/Topbar.vue'

import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.component('topbar', Topbar)
// FastClick.attach(document.body)

new Vue({
  el: '#app',
  render: h => h(App)
})

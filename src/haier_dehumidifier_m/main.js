if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../mock/dehumidifier/index.js')
}

import Vue from 'vue'
import App from './App.vue'
import '../../lib/base/air_cleaner/index_m.less'
// import FastClick from 'fastclick'
import Topbar from '../../lib/components/Topbar.vue'

Vue.component('topbar', Topbar)
// FastClick.attach(document.body)

new Vue({
  el: '#app',
  render: h => h(App)
})

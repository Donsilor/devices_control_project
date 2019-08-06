console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../mock/curtains/index.js')
}

import Vue from 'vue'
import App from './App.vue'

import '../../lib/base/curtains/index_m.less'

import FastClick from 'fastclick'

import Navigator from './components/Navigator.vue'
import Curtain from './components/Curtain.vue'
import Control from './components/Control.vue'

Vue.component('navigator', Navigator)
Vue.component('curtain', Curtain)
Vue.component('control', Control)

FastClick.attach(document.body)

new Vue({
  el: '#app',
  render: h => h(App)
})

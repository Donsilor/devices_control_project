console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../../mock/air_condition/index.js')
}
import Vue from 'vue'
import App from './App.vue'
import Topbar from '@lib/components/Topbar.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

// import FastClick from 'fastclick'
// FastClick.attach(document.body)

import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger_vue'
Vue.use(AlloyFingerVue, {
  AlloyFinger
})

Vue.component('topbar', Topbar)

new Vue({
    el: '#app',
    render: h => h(App)
})

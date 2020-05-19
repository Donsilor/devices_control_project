console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/duya_curtains/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import NewTopBar from '@lib/components/NewTopBar.vue'
import StatusTip from '@lib/components/StatusTip.vue'
// import * as filters from './filters' // global filters
// register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

Vue.component('NewTopBar', NewTopBar)
Vue.component('StatusTip', StatusTip)
FastClick.attach(document.body)

new Vue({
    el: '#app',
    store,
    render: h => h(App)
})

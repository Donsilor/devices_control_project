console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/clothes_hanger/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'
import '@lib/base/animation.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import NewTopBar from '@lib/components/NewTopBar.vue'
import StatusTip from '@lib/components/StatusTip.vue'


FastClick.attach(document.body)
import * as filters from './filters' // global filters
console.log(filters,'filters')

Vue.component('NewTopBar', NewTopBar)
Vue.component('StatusTip', StatusTip)

// register global utility filters.
for (const key in filters) {
  Vue.filter(key, filters[key])
}
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

new Vue({
    el: '#app',
    store,
    render: h => h(App)
})

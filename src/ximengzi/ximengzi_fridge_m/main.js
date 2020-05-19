console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/fridge/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import Topbar from '@lib/components/Topbar.vue'
import NewTopbar from '@lib/components/NewTopbar.vue'
import StatusTip from '@lib/components/StatusTip.vue'

Vue.component('topbar', Topbar)
Vue.component('newtopbar', NewTopbar)
Vue.component('StatusTip', StatusTip)
FastClick.attach(document.body)
import * as filters from './filters' // global filters

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
    el: '#app',
    store,
    render: h => h(App)
})

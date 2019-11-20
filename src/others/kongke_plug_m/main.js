console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/kongke_plug/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import NewTopBar from '@lib/components/NewTopBar.vue'

import { DatetimePicker } from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.component(DatetimePicker.name, DatetimePicker)

Vue.component('NewTopBar', NewTopBar)
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

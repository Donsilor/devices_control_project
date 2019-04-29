console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
    require('../../mock/curtains/index.js')
}
import Vue from 'vue'
import App from './App.vue'
import Topbar from '../../lib/components/Topbar.vue'

import '../../lib/base/air_condition/index_m.less'

import FastClick from 'fastclick'

FastClick.attach(document.body)

Vue.component('topbar', Topbar)

new Vue({
    el: '#app',
    render: h => h(App)
})

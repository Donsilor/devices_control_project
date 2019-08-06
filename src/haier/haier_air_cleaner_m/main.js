console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../../mock/air_cleaner/index.js')
}
import Vue from 'vue'
import App from './App.vue'
<<<<<<< HEAD
import '@lib/base/air_cleaner/index_m.less'
=======
import '@lib/base/reset.less'
import '@lib/base/common.less'

>>>>>>> 9e659662c85e56e20f7ce80ce82a55ec6e9660dd
import FastClick from 'fastclick'
import Topbar from '@lib/components/Topbar.vue'

Vue.component('topbar', Topbar)
FastClick.attach(document.body)

new Vue({
    el: '#app',
    render: h => h(App)
})

console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/new_water_heater/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import Topbar from '@lib/components/NewTopbar.vue'
import StatusTip from '@lib/components/StatusTip.vue'

Vue.component('topbar', Topbar)
Vue.component('StatusTip', StatusTip)
FastClick.attach(document.body)
import * as filters from './filters' // global filters

// H5路由处理
import Router from 'vue-router'
Vue.use(Router)
import Index from './Index.vue'
import OfflineHelpPage from '@lib/components/OfflineHelpPage.vue'


const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/OfflineHelpPage',
    name: 'OfflineHelpPage',
    component: OfflineHelpPage,
  }
  ]
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})

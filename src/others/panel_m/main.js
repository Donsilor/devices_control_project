console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/panel/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'
import '@lib/base/animation.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import NewTopBar from '@lib/components/NewTopBar.vue'
import StatusTip from '@lib/components/SupconStatusTip.vue'

import Router from 'vue-router'
Vue.use(Router)
import Index from './components/Index.vue'
import Allocation from './components/Allocation.vue'
import SupconOfflineHelpPage from '@lib/components/SupconOfflineHelpPage.vue'



const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/Allocation',
    name: 'Allocation',
    component: Allocation,
  },
  {
    path: '/SupconOfflineHelpPage',
    name: 'SupconOfflineHelpPage',
    component: SupconOfflineHelpPage,
  }
  ]
})

FastClick.attach(document.body)
// import * as filters from './filters' // global filters
Vue.component('NewTopBar', NewTopBar)
Vue.component('StatusTip', StatusTip)

// register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})

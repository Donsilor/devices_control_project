console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../../mock/air_quality_check/index.js')
}
import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from './components/Index.vue'
import PMsynopsis from './components/PMsynopsis.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import Topbar from '@lib/components/Topbar.vue'


const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/PMsynopsis',
    name: 'PMsynopsis',
    component: PMsynopsis
  }
  ]
})

Vue.component('topbar', Topbar)
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../../mock/cooker/index.js')
}
import Vue from 'vue'
// import Router from 'vue-router'
import App from './App.vue'
import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import Topbar from '@lib/components/Topbar.vue'
// Vue.use(Router)

// const router = new Router({
//   routes: [
//     {
//       path:'/list',
//       name:'list',
//       component:List
//     },
//     {
//       path:'/warnBox',
//       name:'warnBox',
//       component:warnBox
//     }
//   ]
// })
Vue.component('topbar', Topbar)
FastClick.attach(document.body)
import * as filters from './filters' // global filters

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
    el: '#app',
    store,
    // router,
    render: h => h(App)
})

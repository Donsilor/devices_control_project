console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/hongyan_plug/index.js')
}
import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import '@lib/base/reset.less'
import '@lib/base/common.less'
// import Vuex from 'vuex'
import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import Topbar from '@lib/components/Topbar.vue'
import Index from './components/Index.vue'
import Log from './components/Log.vue'
import Time from './components/Time.vue'
Vue.use(Router)
// Vue.use(Vuex)
Vue.component('topbar', Topbar)
FastClick.attach(document.body)
import * as filters from './filters' // global filters

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/log',
      name: 'log',
      component: Log
    },
    {
      path: '/time',
      name: 'time',
      component: Time
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
    components: { App },
    template: '<App />'
})

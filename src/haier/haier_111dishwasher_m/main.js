console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/dishwasher/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import NewTopBar from '@lib/components/NewTopBar.vue'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
import * as filters from './filters' // global filters
// 路由
import Router from 'vue-router'
import Index from './components/Index.vue'
import Washing from './components/Washing.vue'
Vue.use(Router)
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/Washing',
      name: 'washing',
      component: Washing
    },
    // {
    //   path: '/time',
    //   name: 'time',
    //   component: Time
    // }
  ]
})
Vue.component('NewTopBar', NewTopBar)
FastClick.attach(document.body)

new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App />'
})

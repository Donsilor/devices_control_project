//import Router from "../../others/tv_628_m/main"

console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/fangtai_steam_cooker/index.js')
}
import Vue from 'vue'
import vueRouter from 'vue-router'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import NewTopBar from '@lib/components/NewTopBar.vue'
import Index from './components/Index2'
import DeviceStatus from './components/deviceStatus'
import DevicePause from './components/devicePause'
import DeviceFinish from './components/deviceFinish'
import WaterBoxOpen from './components/waterBoxOpen'

Vue.use(vueRouter)
FastClick.attach(document.body)
import * as filters from './filters' // global filters
Vue.component('NewTopBar', NewTopBar)
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

let router = new vueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/deviceStatus',
      name: 'deviceStatus',
      component: DeviceStatus
    },
    {
      path: '/devicePause',
      name: 'devicePause',
      component: DevicePause
    },
    {
      path: '/deviceFinish',
      name: 'deviceFinish',
      component: DeviceFinish
    },
    {
      path: '/waterBoxOpen',
      name: 'waterBoxOpen',
      component: WaterBoxOpen
    }
  ]
})


new Vue({
    el: '#app',
    store,
    router,
    components: {
      App
    },
    template: '<App />'
})

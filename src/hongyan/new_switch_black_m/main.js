console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/hongyan_switch_m/index.js')
}
import Vue from 'vue'
import App from './App.vue'
// import longPress from "@lib/longPress.js";

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
import FastClick from 'fastclick'
import Topbar from '@lib/components/NewTopbar.vue'
import StatusTip from '@lib/components/StatusTip.vue'
import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

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

Vue.component('topbar', Topbar)
Vue.component('StatusTip', StatusTip)
FastClick.attach(document.body)
Vue.directive('longpress', {
  bind: function(el, binding, vNode) {
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.name
      let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
      if (compName) { warn += `Found in component '${compName}' ` }
      console.warn(warn)
    }
    let pressTimer = null
    let start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler(el.dataset.id)
        }, 1000)
      }
    }
    let cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    const handler = (e) => {
      binding.value(e)
    }
    el.addEventListener("mousedown", start)
    el.addEventListener("touchstart", start)
    el.addEventListener("click", cancel)
    el.addEventListener("mouseout", cancel)
    el.addEventListener("touchend", cancel)
    el.addEventListener("touchcancel", cancel)
  }
})
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})

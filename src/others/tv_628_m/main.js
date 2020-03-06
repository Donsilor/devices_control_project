if (process.env.NODE_ENV == 'development') {
  require('@mock/tv/index.js')
}
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import * as service from './service'
import '@lib/base/common.less'
import '@lib/base/reset.less'
import '@lib/base/tv/index_m.less'


import * as filters from './filters' // global filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger_vue'
import store from './store'
import router from './router'

Vue.use(AlloyFingerVue, {
  AlloyFinger
})

// Vue.use(Vuex)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})
// Vue.component('statusbar', Statusbar)

// 强制关闭3d(详情页改成不透明了)
// window.Swiper.prototype.support.transforms3d = false

// hack: app多次执行ready
let is_ready = false
let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

// app jsbridge ready
HdSmart.onDeviceListen(function(data) {
  if (data && data.result) {
    store.dispatch('setOnline', data.result.attribute.connectivity)
  }
})
HdSmart.ready(() => {
  if (!is_ready) {
    is_ready = true

    if (window.device_name) {
      store.commit('setDeviceName', window.device_name)
    }

    if(window.status_bar_height){
        store.commit('setStatusBarHeight', window.status_bar_height / dpr)
    }

    if(window.navigation_bar_height){
        store.commit('setNavigationBarHeight', window.navigation_bar_height / dpr)
    }
      service.getScreenProjectionStatus((error, data) => {
        store.commit('setScreenProjectionStatus', data)
      })
    window.onScreenProjectStatusChanged = function(data) {
      store.commit('setScreenProjectionStatus', data)
    }

    // 解决300ms延迟问题,iOS下报错了
    // FastClick.attach(document.body)

    new Vue({
      el: '#app',
      store,
      router,
      components: {
        App
      },
      template: '<App />'
    })
  }
})

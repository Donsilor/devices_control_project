if (process.env.NODE_ENV == 'development') {
  require('@mock/tv/index.js')
}

import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import $ from 'jquery'
console.log($,'jq-----------------')

// import FastClick from 'fastclick'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueLazyload from 'vue-lazyload'

import App from './App.vue'
import Index from './components/Index.vue'
import List from './components/List.vue'
import Search from './components/Search.vue'
import Detail from './components/Detail.vue'
import Topbar from './components/Topbar.vue'
import remoteControl from './components/remoteControl.vue'
import NewTopbar from '@lib/components/NewTopBar.vue'

import ErrorView from './components/Error.vue'
import NoNetwork from './components/NoNetwork.vue'
import OfflineMask from './components/OfflineMask.vue'
// import Statusbar from './components/Statusbar.vue'
import StatusTip from './components/StatusTip.vue'

import * as service from './service'

import '@lib/base/common.less'
import '@lib/base/reset.less'
import '@lib/base/tv/index_m.less'


import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-unused-vars */
import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger_vue'
Vue.use(AlloyFingerVue, {
  AlloyFinger
})

Vue.use(Vuex)
Vue.use(Router)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

Vue.component('detail', Detail)
Vue.component('topbar', Topbar)
Vue.component('new-topbar', NewTopbar)
Vue.component('offline-mask', OfflineMask)
Vue.component('StatusTip', StatusTip)
Vue.component('remoteControl', remoteControl)
Vue.component('NoNetwork', NoNetwork)

// Vue.component('statusbar', Statusbar)

// 强制关闭3d(详情页改成不透明了)
// window.Swiper.prototype.support.transforms3d = false

var scrollTop = 0
var docEl = document.body

const store = new Vuex.Store({
  state: {
    online: true,
    detailVisible: false,
    activeDetail: {},
    device_name: '',
    tvStatus: {
      tvOnlineStatus: 1,
      screenProjectType: 0,
      screenProjectTitle: ``
    },
    status_bar_height: 20,
    navigation_bar_height: 44
  },
  getters: {
    isStatusBarShow(state)  {
      return window.device_uuid && (state.tvStatus.screenProjectType != 0 || state.tvStatus.tvOnlineStatus != 1)
    }
  },
  mutations: {
    showDetail(state, payload) {
      state.detailVisible = true
      if(payload) {
        state.activeDetail = payload
        scrollTop = docEl.scrollTop
        docEl.scrollTop = 0
      }
      service.RemoteController({
        'show': true
      })
    },
    hideDetail(state) {
      state.detailVisible = false
      var path = router.history.current.name
      if (path === 'index') {
        service.RemoteController({
          'show': false
        })
      } else {
        service.RemoteController({
          'show': true
        })
      }
      setTimeout(() => {
        docEl.scrollTop = scrollTop
      }, 50)
    },
    setOnline(state, payload) {
      state.online = payload
    },
    setDeviceName(state, payload) {
      state.device_name = payload
    },
    setScreenProjectionStatus(state, payload) {
      state.tvStatus = payload
    },
    setStatusBarHeight(state, payload) {
        state.status_bar_height = payload
    },
    setNavigationBarHeight(state, payload) {
        state.navigation_bar_height = payload
    }
  },
  actions: {
    showDetail({
      commit
    }, item) {
      commit('showDetail', item)
    },
    hideDetail: ({
      commit
    }) => {
      commit('hideDetail')
    },
    setOnline({
      commit
    }, onlineStr) {
      commit('setOnline', onlineStr == 'online')
    }
  }
})

const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/list',
    name: 'list',
    component: List,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  },
  {
    path: '/NoNetwork',
    name: 'NoNetwork',
    component: NoNetwork
  }
  ]
})
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

    // setTimeout(() => {
      service.getScreenProjectionStatus((error, data) => {
        store.commit('setScreenProjectionStatus', data)
      })
    // }, 150)

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

if(process.env.NODE_ENV == 'development'){
    require('../../mock/tv/index.js')
}

import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import FastClick from 'fastclick'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueLazyload from 'vue-lazyload'

import App from './App.vue'
import Index from './components/Index.vue'
import List from './components/List.vue'
import Search from './components/Search.vue'
import Detail from './components/Detail.vue'
import Topbar from './components/Topbar.vue'
import ErrorView from './components/Error.vue'
import OfflineMask from './components/OfflineMask.vue'
//import Statusbar from './components/Statusbar.vue'
import StatusTip from './components/StatusTip.vue'

import * as service from './service'

Vue.use(Vuex)
Vue.use(Router)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

Vue.component('detail', Detail)
Vue.component('topbar', Topbar)
Vue.component('offline-mask', OfflineMask)
Vue.component('StatusTip', StatusTip)
//Vue.component('statusbar', Statusbar)

//强制关闭3d(详情页改成不透明了)
//window.Swiper.prototype.support.transforms3d = false

var scrollTop = 0
var docEl = document.body

const store = new Vuex.Store({
    state: {
        toolbarHeight: 38.89,
        online: true,
        detailVisible: false,
        activeDetail: {},
        device_name: '',
        tvStatus: {
            tvOnlineStatus: 1,
            screenProjectType: 0,
            screenProjectTitle: ''
        }
    },
    mutations: {
        showDetail(state, payload) {
            state.detailVisible = true
            state.activeDetail = payload
        },
        hideDetail(state) {
            state.detailVisible = false
        },
        setOnline(state, payload) {
            state.online = payload
        },
        setDeviceName(state, payload) {
            state.device_name = payload
        },
        setScreenProjectionStatus(state, payload){
            state.tvStatus = payload
        }
    },
    actions: {
        showDetail({ commit }, item) {
            scrollTop = docEl.scrollTop
            docEl.scrollTop = 0
            commit('showDetail', item)
        },
        hideDetail: ({ commit }) => {
            commit('hideDetail')
            setTimeout(() => {
                docEl.scrollTop = scrollTop
            }, 50)
        },
        setOnline({ commit }, onlineStr) {
            commit('setOnline', onlineStr=='online' ? true : false)
        }
    }
})

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/list',
      name: 'list',
      component: List
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView
    }
  ]
})
//hack: app多次执行ready
let is_ready = false
let current_page = 'index'
let thaf_timer

//app jsbridge ready
HdSmart.onDeviceListen(function(data){
    if(data && data.result){
        store.dispatch('setOnline', data.result.attribute.connectivity)
    }
})

HdSmart.ready(() => {
  //HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%')

  if(!is_ready){

    is_ready = true

    // HdSmart.Device.getSnapShot((data) => {
    //     store.commit('setDeviceName', data.device_name)
    // })

    if(window.device_name){
        store.commit('setDeviceName', window.device_name)
    }

    service.getScreenProjectionStatus((error, data) => {
        store.commit('setScreenProjectionStatus', data)
    })

    window.onScreenProjectStatusChanged = function(data){
        store.commit('setScreenProjectionStatus', data)
    }

    //解决300ms延迟问题,iOS下报错了
    // FastClick.attach(document.body)

    router.beforeEach((to,from,next) => {
      if(current_page !== to.name){
        if(thaf_timer){
            clearTimeout(thaf_timer)
        }
        if(to.name === 'index' || to.name === 'error'){
          thaf_timer = setTimeout(()=>{
            docEl.scrollTop = 0
            HdSmart.UI.toggleHeadAndFoot(true)
          },200)
        }else{
          HdSmart.UI.toggleHeadAndFoot(false)
        }
        current_page = to.name
      }
      next()
    })

    new Vue({
      el: '#app',
      store,
      router,
      template: '<App />',
      components: { App }
    });

  }

})


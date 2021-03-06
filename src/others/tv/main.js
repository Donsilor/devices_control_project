if(process.env.NODE_ENV == 'development'){
    require('../../mock/tv/index.js')
}

import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import FastClick from 'fastclick'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'

import App from './App.vue'
import Index from './components/Index.vue'
import List from './components/List.vue'
import Search from './components/Search.vue'
import Detail from './components/Detail.vue'
import Topbar from './components/Topbar.vue'
import ErrorView from './components/Error.vue'
import StatusTip from './components/StatusTip.vue'
import AlloyFinger from 'alloyfinger/alloy_finger'
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue'
//import Statusbar from './components/Statusbar.vue'
import watermark from '../../lib/watermark'
import 'swiper/dist/css/swiper.css'

import * as service from './service'

Vue.use(Vuex)
Vue.use(Router)
Vue.use(VueAwesomeSwiper)
Vue.use(AlloyFingerVue, {
    AlloyFinger
})
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

Vue.component('detail', Detail)
Vue.component('topbar', Topbar)
Vue.component('StatusTip', StatusTip)
//Vue.component('statusbar', Statusbar)

//强制关闭3d(详情页改成不透明了)
//window.Swiper.prototype.support.transforms3d = false

const store = new Vuex.Store({
    state: {
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
            service.RemoteController({'show':false});
        },
        hideDetail(state) {
            state.detailVisible = false
            var path = router.history.current.name;
            if(path==='index'){
                service.RemoteController({'show':false});
            }else{
                service.RemoteController({'show':true});
            }
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
            commit('showDetail', item)
        },
        hideDetail: ({ commit }) => commit('hideDetail'),
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

let current_page = ''

//app jsbridge ready
HdSmart.ready(() => {
  //HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%')
  HdSmart.UI.showLoading()

    if(window.device_name){
        store.commit('setDeviceName', window.device_name)
    }

    service.getScreenProjectionStatus((error, data) => {
        store.commit('setScreenProjectionStatus', data)
    })

    window.onScreenProjectStatusChanged = function(data){
        store.commit('setScreenProjectionStatus', data)
    }

    //解决300ms延迟问题
    FastClick.attach(document.body)

    router.beforeEach((to,from,next) => {
      if(current_page !== to.name){
        if(to.name === 'index' || to.name === 'error'){
            HdSmart.UI.toggleHeadAndFoot(true)
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

    if(window.user_name && window.phone){
        watermark()
        watermark({el:'.page-index2'})
        watermark({el:'.page-detail'})
    }

})


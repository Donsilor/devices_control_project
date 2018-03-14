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
import AlloyFinger from 'alloyfinger/alloy_finger'
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue'
//import Statusbar from './components/Statusbar.vue'
import watermark from '../../lib/watermark'
import 'swiper/dist/css/swiper.css'

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
//Vue.component('statusbar', Statusbar)

//强制关闭3d(详情页改成不透明了)
//window.Swiper.prototype.support.transforms3d = false

const store = new Vuex.Store({
    state: {
        detailVisible: false,
        activeDetail: {}
    },
    mutations: {
        showDetail(state, payload) {
            state.detailVisible = true
            state.activeDetail = payload
        },
        hideDetail(state) {
            state.detailVisible = false
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
//hack: app多次执行ready
let is_ready = false
let current_page = 'index'
let thaf_timer

//app jsbridge ready
HdSmart.ready(() => {
  //HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%')

  if(!is_ready){

    is_ready = true

    //解决300ms延迟问题
    FastClick.attach(document.body)

    router.beforeEach((to,from,next) => {
      if(current_page !== to.name){
        if(thaf_timer){
            clearTimeout(thaf_timer)
        }
        if(to.name === 'index' || to.name === 'error'){
          thaf_timer = setTimeout(()=>{
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

    if(window.user_name && window.phone){
        watermark()
        watermark({el:'.page-index2'})
        watermark({el:'.page-detail'})
    }

  }

})


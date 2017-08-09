/**
   * TODO: 
   * 1、播放记录 playRecords （3种场景需要记录：1点播，2自动播放，3遥控器播放），记录格式暂定如下：
   * [{vid:"",index:1,playing:false}]
   * 2、播放状态 playStateChange
   * 3、动画，webview性能问题，暂取消
   */

import Vue from 'vue'
import Router from 'vue-router'
//import Vuex from 'vuex'
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
//import Statusbar from './components/Statusbar.vue'

Vue.use(Router)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

Vue.component('detail', Detail)
Vue.component('topbar', Topbar)
//Vue.component('statusbar', Statusbar)

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

//app jsbridge ready
HdSmart.ready(() => { 
  //HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%')
  
  if(!is_ready){

    is_ready = true
    
    //解决300ms延迟问题
    FastClick.attach(document.body)

    router.beforeEach((to,from,next) => {
      if(to.name === 'index' || to.name === 'error'){  
        setTimeout(()=>{
          HdSmart.UI.toggleHeadAndFoot(true)
        },300)
      }else{  
        HdSmart.UI.toggleHeadAndFoot(false)
      }
      next()
    })

    new Vue({
      el: '#app',
      router,
      template: '<App />',
      components: { App }
    });

  }

})


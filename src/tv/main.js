import Vue from 'vue'
import Router from 'vue-router'
//import Vuex from 'vuex'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'
//import AlloyFinger from 'alloyfinger/alloy_finger'
//import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue'

import App from './App.vue'
import Index from './components/Index.vue'
import List from './components/List.vue'
import Search from './components/Search.vue'
import Detail from './components/Detail.vue'
import Topbar from './components/Topbar.vue'
//import Statusbar from './components/Statusbar.vue'

Vue.use(Router)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

/*
Vue.use(AlloyFingerVue, {
    AlloyFinger
});
*/

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
    }
  ]
})

let is_ready = false

window.onDeviceReady = function(callback){
  if(!is_ready){  
    is_ready = true
    HdSmart.ready(callback)
  }else{  
    
  }
}

HdSmart.ready(() => { 
  if(!is_ready){
    console.log('我自己的ready')
    is_ready = true
    
    HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%')
    
    router.beforeEach((to,from,next) => {
      console.log('router change',to)
      if(to.name === 'index'){  
        HdSmart.UI.toggleHeadAndFoot(true)
      }else{  
        HdSmart.UI.toggleHeadAndFoot(false)
      }
      //setTime
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


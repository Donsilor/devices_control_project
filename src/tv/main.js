import Vue from 'vue'
import Router from 'vue-router'
//import Vuex from 'vuex'
import FastClick from 'fastclick'

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

HdSmart.ready(() => { 
  //HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%')
  if(!is_ready){

    is_ready = true
    
    FastClick.attach(document.body)

    router.beforeEach((to,from,next) => {
      if(to.name === 'index'){  
        HdSmart.UI.toggleHeadAndFoot(true)
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


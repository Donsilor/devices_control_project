import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import VueAwesomeSwiper from 'vue-awesome-swiper'
//import AlloyFinger from 'alloyfinger/alloy_finger'
//import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue'

import App from './App.vue'
import Index from './components/Index.vue'
import List from './components/List.vue'
import Search from './components/Search.vue'
import Detail from './components/Detail.vue'
import Topbar from './components/Topbar.vue'

Vue.use(Router)
Vue.use(VueAwesomeSwiper)
/*
Vue.use(AlloyFingerVue, {
    AlloyFinger
});
*/

Vue.component('detail',Detail)
Vue.component('topbar',Topbar)

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


HdSmart.ready(() => { 

  //设置触摸区域（好像不太管用）
  HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%')

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
    template: '<App/>',
    components: { App }
  });

})


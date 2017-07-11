import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import App from './App.vue'
import Index from './components/Index.vue'
import List from './components/List.vue'
import Search from './components/Search.vue'
import Detail from './components/Detail.vue'
import Topbar from './components/Topbar.vue'

Vue.component('detail',Detail)
Vue.component('topbar',Topbar)

Vue.use(Router)

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

router.beforeEach((to,from,next) => {
  if(to.name === 'index'){  
    HdSmart.UI.toggleHeadAndFoot(true)
  }else{  
    HdSmart.UI.toggleHeadAndFoot(false)
  }
  next()
})

HdSmart.ready(() => { 
  new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })
})


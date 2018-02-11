import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import FastClick from 'fastclick'

import App from './App.vue'
import Index from './components/Index.vue'
import Log from './components/Log.vue'

Vue.use(Vuex)
Vue.use(Router)

const router =  new Router({
    routes: [
      {
        path: '/',
        name: 'index',
        component: Index
      },
      {
        path: '/log',
        name: 'log',
        component: Log
      }
    ]
  })

  new Vue({
    el: '#app',
    router,
    template: '<App />',
    components: { App }
  });

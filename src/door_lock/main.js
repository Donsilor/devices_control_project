import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import FastClick from 'fastclick'

import App from './App.vue'
import Index from './components/Index.vue'
import Log from './components/Log.vue'

import Calendar from './components/DatePicker/modules/index';

Vue.use(Calendar);

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

//   router.push('log')

  HdSmart.ready(() => {

    router.beforeEach((to, from, next) => {
        if(to.name == 'index'){
            HdSmart.UI.toggleHeadAndFoot(true)
        }else{
            HdSmart.UI.toggleHeadAndFoot(false)
        }
        next()
    })

  })

  new Vue({
    el: '#app',
    router,
    template: '<App />',
    components: { App }
  });



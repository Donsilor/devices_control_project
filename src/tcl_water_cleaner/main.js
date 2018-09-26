if(process.env.NODE_ENV == 'development'){
    require('../../mock/water_cleaner/index.js')
}

import Vue from 'vue'
import Index from './components/Index.vue'//路由页面，router-view
import App from './App.vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import Alertpage from './components/Alertpage'
import '../../lib/base/water_cleaner/index.less'

import FastClick from 'fastclick'

Vue.use(Router)
Vue.use(Vuex)

FastClick.attach(document.body)

Vue.filter('toDays', function (val) {
    return Math.ceil(val/24)
})


const store = new Vuex.Store({
    state: {
        alertPage: false,
    },
    mutations: {
        showAlertpage(state, payload) {
            state.alertPage = true
            // state.activeDetail = payload
            // service.RemoteController({'show':false});
        },
        hideAlertpage(state) {
           state.alertPage = false
        },
    },
    actions: {
        // showDetail({ commit }, item) {
        //     commit('showDetail', item)
        // },
        // hideDetail: ({ commit }) => commit('hideDetail'),
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
          path:'/Alertpage',
          name:'Alertpage',
          component: Alertpage
        }
      ]
    })
  
new Vue({
    el: '#app',
    router,
    store,
    template: '<App />',
    components: { App }
  });


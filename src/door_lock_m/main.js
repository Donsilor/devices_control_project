if(process.env.NODE_ENV == 'development'){
    require('../../mock/door_lock/index.js')
}

import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import '../../lib/base/door_lock/index_m.less'

import App from './App.vue'
import Index from './components/Index.vue'
import Log from './components/Log.vue'
import AppAlertPage from '../../lib/components/AppAlertPage'

Vue.use(Router)
Vue.use(Vuex)

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
      // setDeviceName(state, payload) {
      //     state.device_name = payload
      // },
      // setScreenProjectionStatus(state, payload){
      //     state.tvStatus = payload
      // }
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
        path: '/log',
        name: 'log',
        component: Log
      },
      {
        path:'/AppAlertPage',
        name:'AppAlertPage',
        component: AppAlertPage
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


if(process.env.NODE_ENV == 'development'){
    require('../../mock/door_lock/index.js')
}

import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import '../../lib/base/door_lock/index.less'

import App from './App.vue'
import Index from './components/Index.vue'
import Log from './components/Log.vue'
import AlertPage from './components/Alertpage'

Vue.use(Router)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
      alertPage: false,
      errStore:[]
  },
  mutations: {
      showAlertpage(state, errStore) {
        state.alertPage = true
        state.errStore = errStore
        console.log("state11111",state.errStore)
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
        path:'/AlertPage',
        name:'AlertPage',
        component: AlertPage
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
    store,
    template: '<App />',
    components: { App }
  });


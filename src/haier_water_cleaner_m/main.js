if (process.env.NODE_ENV == 'development') {
  require('../../mock/water_cleaner/index.js')
}

import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import Index from './components/Index.vue' //路由页面，router-view
import App from './App.vue'
import Topbar from '../../lib/components/Topbar.vue'

import Alertpage from './components/AlertPage'

import '../../lib/base/haier_water_cleaner/index_m.less'

import FastClick from 'fastclick'

Vue.use(Router)
Vue.use(Vuex)

FastClick.attach(document.body)

Vue.component('topbar', Topbar)
Vue.filter('toDays', function(val) {
  return Math.ceil(val / 24)
})

const store = new Vuex.Store({
  state: {
    alertPage: false,
    errStore: []
  },
  mutations: {
    showAlertpage(state, errStore) {
      state.alertPage = true
      state.errStore = errStore
      console.log('state11111', state.errStore)
      // state.activeDetail = payload
      // service.RemoteController({'show':false});
    },
    hideAlertpage(state) {
      state.alertPage = false
    }
  },
  actions: {
    // showDetail({ commit }, item) {
    //     commit('showDetail', item)
    // },
    // hideDetail: ({ commit }) => commit('hideDetail'),
  }
})

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/Alertpage',
      name: 'Alertpage',
      component: Alertpage
    }
  ]
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App />'
})

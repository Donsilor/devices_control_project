if (process.env.NODE_ENV == 'development') {
  require('../../../mock/water_cleaner/index.js')
}

import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import Index from './components/Index.vue' //路由页面，router-view
import App from './App.vue'
import Topbar from '../../../lib/components/Topbar.vue'


import '../../../lib/base/haier_water_cleaner/index_m.less'

import FastClick from 'fastclick'
import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Router)
Vue.use(Vuex)

FastClick.attach(document.body)

Vue.component('topbar', Topbar)
Vue.filter('toDays', function(val) {
  return Math.ceil(val / 24)
})




const store = new Vuex.Store({
  state: {
    errStore: []
  },
  mutations: {
  },
  actions: {
  }
})

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
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

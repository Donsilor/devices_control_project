import Vue from 'vue'
import Router from 'vue-router'

import Wave from '../components/Wave.vue'
import Dashboard from '../components/Dashboard.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: Wave
    },{
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }
  ]
})

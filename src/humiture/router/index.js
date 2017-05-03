import Vue from 'vue'
import Router from 'vue-router'

import Wave from '../components/Wave'
import Dashboard from '../components/Dashboard'

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

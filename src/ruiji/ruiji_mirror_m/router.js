import Vue from 'vue'
import Index from './views/Index.vue'
import OfflineHelpPage from '@lib/components/OfflineHelpPage.vue'

import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index,
    meta: {
      keepAlive: true
    }
  },
    {
      path: '/OfflineHelpPage',
      name: 'OfflineHelpPage',
      component: OfflineHelpPage,
      meta: {
        keepAlive: false
      }
    }
  ]
})

export default router

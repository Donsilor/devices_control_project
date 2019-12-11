import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Index from './components/Index.vue'
import List from './components/List.vue'
import Search from './components/Search.vue'
import Detail from './components/Detail.vue'
import Topbar from './components/Topbar.vue'
import remoteControl from './components/remoteControl.vue'
import NewTopbar from '@lib/components/NewTopBar.vue'

import ErrorView from './components/Error.vue'
import NoNetwork from './components/NoNetwork.vue'
import OfflineMask from './components/OfflineMask.vue'
// import Statusbar from './components/Statusbar.vue'
import StatusTip from './components/StatusTip.vue'



Vue.component('detail', Detail)
Vue.component('topbar', Topbar)
Vue.component('new-topbar', NewTopbar)
Vue.component('offline-mask', OfflineMask)
Vue.component('StatusTip', StatusTip)
Vue.component('remoteControl', remoteControl)
Vue.component('NoNetwork', NoNetwork)

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
    path: '/list',
    name: 'list',
    component: List,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  },
  {
    path: '/NoNetwork',
    name: 'NoNetwork',
    component: NoNetwork
  }
  ]
})

export default router
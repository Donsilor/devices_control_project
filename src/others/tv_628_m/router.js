import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//懒加载
const Index = () => import('./components/Index.vue')
const List = () => import('./components/List.vue')
const Search = () => import('./components/Search.vue')
const Detail = () => import('./components/Detail.vue')
const ErrorView = () => import('./components/Error.vue')
const NoNetwork = () => import('./components/NoNetwork.vue')

import Topbar from './components/Topbar.vue'
import remoteControl from './components/remoteControl.vue'
import NewTopbar from '@lib/components/NewTopBar.vue'
import OfflineMask from './components/OfflineMask.vue'
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
        keepAlive: false
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

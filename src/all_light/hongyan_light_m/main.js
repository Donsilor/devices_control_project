console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('../../../mock/hongyan_light/index.js')
}
import Vue from 'vue'
import App from './App.vue'

import '@lib/base/reset.less'
import '@lib/base/common.less'

import store from '@lib/store/index.js'
// import Topbar from '@lib/components/Topbar.vue'
import NewTopbar from '@lib/components/NewTopBar.vue'
import StatusTip from '@lib/components/StatusTip.vue'

Vue.component('new-topbar', NewTopbar)
Vue.component('StatusTip', StatusTip)
new Vue({
    el: '#app',
    store,
    render: h => h(App)
})

console.log(`argv_is_mock: ${argv_is_mock}`)
if (argv_is_mock || process.env.NODE_ENV == 'development') {
  require('@mock/ruiji_mirror')
}
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@lib/base/reset.less'
import store from '@lib/store/index.js'
import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})

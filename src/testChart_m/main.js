import Vue from 'vue'
import App from './App.vue'
import '@lib/base/reset.less'
import '@lib/base/common.less'
new Vue({
  el:'#app',
  render: h => h(App),
})
if (process.env.NODE_ENV == "development") {
    require("@mock/weather/index.js")
}

import Vue from "vue"
import App from "./App.vue"

import '@lib/base/weather/index.less'

import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger_vue'

//components
import SwitchCity from "./components/SwitchCity.vue"

// Vue.component('navigator', Navigator);
Vue.component("switchCity", SwitchCity)

Vue.use(AlloyFingerVue, {
  AlloyFinger
})

new Vue({
    el: "#app",
    render: h => h(App)
})

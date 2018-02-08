import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'

FastClick.attach(document.body)

Vue.filter('toDays', function (val) {
    return Math.ceil(val/24)
})

new Vue({
    el: '#app',
    render: h => h(App)
});

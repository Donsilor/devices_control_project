import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'

require ('mint-picker/lib/index.css')
import Picker from 'mint-picker'
Vue.component('mt-picker', Picker)

FastClick.attach(document.body)

new Vue({
    el: '#app',
    render: h => h(App)
});

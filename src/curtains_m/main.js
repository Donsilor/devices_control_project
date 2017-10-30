import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'

import Navigator from './components/Navigator.vue';
import Curtain from './components/Curtain.vue';
import Control from './components/Control.vue';

Vue.component('navigator', Navigator);
Vue.component('curtain', Curtain);
Vue.component('control', Control);

FastClick.attach(document.body)


new Vue({
    el: '#app',
    render: h => h(App)
});

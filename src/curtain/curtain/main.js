import Vue from 'vue'
import App from './App.vue'

import AlloyFinger from 'alloyfinger/alloy_finger';
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';

import Navigator from './components/Navigator.vue';
import Curtain from './components/Curtain.vue';
import Clothes from './components/Clothes.vue';
import Control from './components/Control.vue';

import './assets/hd.sdk';

Vue.component('navigator', Navigator);
Vue.component('curtain', Curtain);
Vue.component('clothes', Clothes);
Vue.component('control', Control);

Vue.use(AlloyFingerVue, {
    AlloyFinger
});

HdSmart.ready(() => {
    new Vue({
        el: '#app',
        render: h => h(App)
    });
});
if(process.env.NODE_ENV == 'development'){
    require('../../mock/curtains/index.js')
}

import Vue from 'vue'
import App from './App.vue'

import AlloyFinger from 'alloyfinger/alloy_finger';
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';

import Navigator from './components/Navigator.vue';
import Curtain from './components/Curtain.vue';
import Control from './components/Control.vue';

Vue.component('navigator', Navigator);
Vue.component('curtain', Curtain);
Vue.component('control', Control);

Vue.use(AlloyFingerVue, {
    AlloyFinger
});

new Vue({
    el: '#app',
    render: h => h(App)
});

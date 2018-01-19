import Vue from 'vue'
import App from './App.vue'

import AlloyFinger from 'alloyfinger/alloy_finger';
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';
import VueResource from 'vue-resource'


// Vue.component('navigator', Navigator);

Vue.use(VueResource)
Vue.use(AlloyFingerVue, {
    AlloyFinger
});

new Vue({
    el: '#app',
    render: h => h(App)
});

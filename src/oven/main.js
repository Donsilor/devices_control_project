import Vue from 'vue'
import App from './App.vue'

import AlloyFinger from 'alloyfinger/alloy_finger';
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';

// Vue.component('navigator', Navigator);

Vue.use(AlloyFingerVue, {
    AlloyFinger
});

new Vue({
    el: '#app',
    render: h => h(App)
});

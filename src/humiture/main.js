// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import IndexPage from '@/components/IndexPage'
import DetailPage from '@/components/DetailPage'
import Wave from '@/components/Wave'
import Dashboard from '@/components/Dashboard'
import ListView from '@/components/ListView'

import './assets/hd.sdk';

import '@/utils';

// Vue.config.productionTip = true;

Vue.component('index-page', IndexPage);
Vue.component('detail-page', DetailPage);
Vue.component('wave', Wave);
Vue.component('dashboard', Dashboard);
Vue.component('list-view', ListView);

// should run in mobile app clint env.
HdSmart.ready(() => {
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  });
});





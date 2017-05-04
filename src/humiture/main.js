// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'

import IndexPage from './components/IndexPage.vue'
import DetailPage from './components/DetailPage.vue'
import Wave from './components/Wave.vue'
import Dashboard from './components/Dashboard.vue'
import ListView from './components/ListView.vue'

import './utils';

// Vue.config.productionTip = true;

Vue.component('index-page', IndexPage);
Vue.component('detail-page', DetailPage);
Vue.component('wave', Wave);
Vue.component('dashboard', Dashboard);
Vue.component('list-view', ListView);

// should run in mobile app clint env.
HdSmart.ready(() => {
  HdSmart.UI.showLoading();
  new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
  });
});





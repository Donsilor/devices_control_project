import Vue from 'vue'
import App from './App.vue'


import './assets/hd.sdk';
import './assets/base.css';

import LogTitle from './components/LogTitle.vue';
import LogList from './components/LogList.vue';
import PullToRefresh from './components/PullToRefresh.vue';
import Calendar from './components/Calendar.vue';
import LogTool from './components/LogTool.vue';
import store from './vuex/store';

Vue.component('log-title', LogTitle);
Vue.component('log-list', LogList);
Vue.component('pull-to-refresh', PullToRefresh);
Vue.component('calendar', Calendar);
Vue.component('log-tool',LogTool);


Vue.filter('tf',function (time) {
    let weeks = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    let today = new Date();
    let targetDate = new Date(time);
    let day = targetDate.getDay();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();
    let formatYear = targetDate.getFullYear();
    let formatMonth = targetDate.getMonth();
    let formatDate = targetDate.getDate();
    let dateString = '';
    time = + new Date(formatYear,formatMonth,formatDate);
    if(+ new Date(year,month,date) == time){
        dateString = '今天';
    } else if( + new Date(year,month,date - 1) == time){
        dateString = '昨天';
    }else{
        dateString = `${formatYear}年${formatMonth + 1}月${formatDate}日`;
    }
    return `${dateString} ${weeks[day]}`;
});
HdSmart.ready(() => {
    new Vue({
        el: '#app',
        store:store,
        render: h => h(App)
    });
});
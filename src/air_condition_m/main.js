/**
 * Created by lenovo on 2017/6/27.
 */
import Vue from 'vue';
import App from './App.vue';
import FastClick from 'fastclick'

FastClick.attach(document.body)

new Vue({
    el: '#app',
    render: h => h(App)
});

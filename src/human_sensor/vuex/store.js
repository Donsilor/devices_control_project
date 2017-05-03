import Vue from 'vue';
import Vuex from 'vuex';

const moment = require('moment');

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        current_time: 0, //日期组件显示的当前日期
        source_time: 0,
        ptr_down_time: 0, //下拉刷新的最新时间
        ptr_up_time: 0, //上拉刷洗的最新时间
        logsInDate: {}, //每天的日志缓存,
        logDateList: [],
        logByTime: {},
        jumpToDate: false
    },
    mutations: {
        chooseDate (state, date){
            let timestamp = date;
            let chooseKey = moment(date).format('YYYY-MM-DD');
            let sourceKey = moment(state.source_time).format('YYYY-MM-DD');
            state.jumpToDate = chooseKey != sourceKey;
            state.ptr_up_time = timestamp;
            state.ptr_down_time = timestamp;
            state.logsInDate = {};
            state.logDateList = [];
            state.logByTime = {};
        },

        updateSourceTime (state, source_time){
            state.source_time = source_time;
        },

        updateDownTime (state, down_time){
            state.ptr_down_time = down_time;
        },
        updateUpTime (state, up_time){
            state.ptr_up_time = up_time;
        },
        addDateToList (state, {timestamp, day}){
            let logDateList = state.logDateList.concat({
                timestamp: timestamp,
                day: day
            });
            logDateList.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
            state.logDateList = logDateList;
        },
        addLogs (state, logs){
            let logsInDate = Object.assign({}, state.logsInDate);
            logs.forEach((log) => {
                if (state.logByTime[log.time]) {
                    return false;
                }
                state.logByTime[log.time] = log;
                log = Object.assign({}, log);
                let createTimeStamp = log.time;
                let time = moment(createTimeStamp);
                let key = time.format('YYYY-MM-DD');
                if (!logsInDate[key]) {
                    logsInDate[key] = {
                        timestamp: createTimeStamp,
                        logs: [log]
                    };
                    store.commit('addDateToList', {
                        timestamp: createTimeStamp,
                        day: key
                    });
                } else {
                    let logs = logsInDate[key].logs;
                    logs.push(log);
                    logs.sort(function (a, b) {
                        return b.time - a.time;
                    });
                }
                log.timeTxt = time.format('HH:mm:ss');
            });
            state.logsInDate = Object.assign({}, logsInDate);
        }
    }
});

export default store;
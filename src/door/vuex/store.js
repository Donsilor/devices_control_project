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
        cache: {},
        jumpToDate: false
    },
    mutations: {
        updateCurrentDate (state, current_time){
            state.current_time = current_time;
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
            let logDateList = state.logDateList.concat([]);
            let length = logDateList.length;
            if (length) {
                for (let index = 0; index < length; index++) {
                    let logDate = logDateList[index];
                    if (logDate.day == day) {
                        break;
                    } else {
                        if (logDate.timestamp > timestamp) {
                            let nextLogDate = logDateList[index + 1];
                            if (!nextLogDate || (nextLogDate.timestamp < timestamp && nextLogDate.day != day)) {
                                logDateList.splice(index + 1, 0, {
                                    timestamp: timestamp,
                                    day: day
                                });
                            }
                        } else {
                            logDateList.splice(index, 0, {
                                timestamp: timestamp,
                                day: day
                            });
                        }
                        state.logDateList = logDateList.concat();
                    }
                }
            } else {
                state.logDateList.push({
                    timestamp: timestamp,
                    day: day
                });
            }
        },
        addLogs (state, logs){
            let logsInDate = Object.assign({}, state.logsInDate);
            logs.forEach((log) => {
                if (state.logByTime[log.time]) {
                    return false;
                }
                state.logByTime[log.time] = log;
                log = Object.assign({}, log);
                let createTimeStamp = log.time * 1000;
                let time = moment(createTimeStamp);
                let key = time.format('YYYY-MM-DD');
                if (!logsInDate[key]) {
                    logsInDate[key] = {
                        timestamp: createTimeStamp,
                        logs: [log]
                    };
                } else {
                    let logs = logsInDate[key].logs;
                    let logsLength = logs.length;
                    for (let logIndex = 0; logIndex < logsLength; logIndex++) {
                        let currentLog = logs[logIndex];
                        if (currentLog.time < log.time) {
                            logs.unshift(log);
                            break;
                            // logs.unshift(log);
                        } else {
                            let nextLog = logs[logIndex + 1];
                            if (!nextLog || nextLog.time < log.time) {
                                logs.splice(logIndex + 1, 0, log);
                                break;
                            }
                        }
                    }
                }
                log.timeTxt = time.format('HH:mm:ss');
                store.commit('addDateToList', {
                    timestamp: createTimeStamp,
                    day: key
                });
            });
            state.logsInDate = Object.assign({}, logsInDate);
        }
    }
});

export default store;
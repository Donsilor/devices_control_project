<template>
    <div class="log-list">
        <pull-to-refresh v-on:onPull="onPull" v-on:onPush="onPush">
            <div class="log-panel-group">
                <div class="log-panel" v-for="daily in logDateList">
                    <div class="log-indicator log-header">
                        <div class="log-indicator-circle"></div>
                        {{daily.timestamp | tf}}
                    </div>
                    <div class="log-indicator log-item" :class="[log.attr.status,log.attr.type]" :key="log.time"
                         v-for="log in logsInDate[daily.day].logs">
                        <div class="log-indicator-circle"></div>
                        <div class="time">{{log.timeTxt}}</div>
                        <div class="status">{{log.attr.status == 'on'?'打开':'关闭'}}</div>
                    </div>
                </div>
            </div>
        </pull-to-refresh>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    export default {
        mounted (){
            this.getInitialData();
            this.$store.subscribe((mutation, state) => {
                if (mutation.type == 'chooseDate') {
                    this.getInitialData();
                }
            })
        },
        computed: mapState(['ptr_down_time', 'ptr_up_time', 'logsInDate', 'logDateList']),
        methods: {
            getInitialData (){
                this.getDeviceLog(this.ptr_down_time, 'down', (data) => {
                    let length = data.log.length;
                    if (length) {
                        this.$store.commit('addLogs', data.log);
                        this.updateDownTime(data.log[0].time);
                        this.updateUpTime(data.log[length - 1].time);
                    }
                }, 16);
            },
            updateDownTime (time){
                if (time < this.ptr_down_time) {
                    this.$store.commit('updateDownTime', time)
                }
            },
            updateUpTime(time){
//                if (time > this.ptr_up_time) {
                this.$store.commit('updateUpTime', time);
//                }
            },
            getDeviceLog (time, direction, callback, items_per_page){
                HdSmart.Device.getDeviceLog({
                    start_time: time,
                    direction: direction,
                    items_per_page: items_per_page
                }, (data) => {
                    if (data.log) {
                        data.log.sort(function (a, b) {
                            return a.time - b.time;
                        })
                    } else {
                        data.log = [];
                    }
                    callback(data);
                })
            },
            onPull (onPullFinishCallback){
                this.getDeviceLog(this.ptr_up_time, 'up', (data) => {
                    let length = data.log.length;
                    if (length) {
                        this.$store.commit('addLogs', data.log);
                        this.updateUpTime(data.log[length - 1].time);
                    }
                    onPullFinishCallback();
                });
            },
            onPush (onPushFinishCallback){
                this.getDeviceLog(this.ptr_down_time, 'down', (data) => {
                    let length = 0;
                    if (data.log && (length = data.log.length)) {
                        this.$store.commit('addLogs', data.log);
                        this.updateDownTime(data.log[length - 1].time);
                    }
                    onPushFinishCallback();
                });
            }
        }
    }
</script>
<style scoped lang="scss">
    .log-list {
        width: 100%;
        position: relative;
        margin-bottom: 90px;
    }

    .log-header {
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        padding-left: 12px;
        color: #808080;
        box-shadow: inset 0 -1px 0 0 #dbdbdb;
    }

    .log-panel-group {
        padding: 0 30px;
    }

    .log-panel {
        padding-left: 36px;
    }

    .log-item {
        height: 96px;
        line-height: 96px;
        display: flex;
        flex-direction: row;
        padding-left: 12px;
        font-size: 30px;
        color: #808080;
    }

    .log-item .status {
        flex: 1;
        text-align: right;
    }

    .log-indicator {
        position: relative;
    }

    .log-indicator-circle {
        width: 12px;
        height: 12px;
        line-height: 12px;
        background: #d2d2d2;
        position: absolute;
        border-radius: 100%;
        left: -27px;
        top: 50%;
        margin-top: -6px;
    }

    .log-indicator.on .log-indicator-circle {
        background: #13d5dc;
    }

    .log-indicator:before {
        position: absolute;
        content: '';
        width: 2px;
        left: -22px;
        top: 0;
        height: 100%;
        background: #dbdbdb;
    }

    .log-panel:first-child .log-header:before {
        top: 50%;
        height: 50%;
    }

    .log-panel:last-child .log-item:last-child:before {
        height: 50%;
    }

    .log-item {
        transition: all 1s;
    }
</style>
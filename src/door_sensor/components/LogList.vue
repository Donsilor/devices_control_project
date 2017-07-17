<template>
    <div class="log-list">
        <pull-to-refresh v-on:onPull="onPull" v-on:onPush="onPush" ref="pullToRefresh" :enablePush="moreData">
            <div class="log-panel-group">
                <div class="log-panel" v-for="daily in logDateList" v-if="logDateList.length">
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
                <div v-if="!logDateList.length && isInitial" class="no-item">
                    暂无数据
                </div>
            </div>
            <div class="no-more-item" v-if="!moreData && logDateList.length">没有更多信息了</div>
        </pull-to-refresh>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import {save_cache, get_cache} from '../helper';
    export default {
        props: {
            is_ready: Boolean
        },
        watch: {
            is_ready (value){
                if (value) {
                    this.getInitialData((data) => {
                        save_cache('init_data', JSON.stringify(data));
                    });
                }
            }
        },
        mounted (){
            let cacheData = get_cache('init_data');
            if (cacheData) {
                cacheData = JSON.parse(cacheData);
                this.initView(cacheData);
            }
            this.$store.subscribe((mutation, state) => {
                if (mutation.type == 'chooseDate') {
                    this.moreData = true;
                    this.getInitialData((data) => {
                        this.$refs.pullToRefresh.goToTop()
                    });
                }
            })
        },
        data (){
            return {
                moreData: true,
                isInitial: false
            }
        },
        computed: mapState(['ptr_down_time', 'ptr_up_time', 'logsInDate', 'logDateList']),
        methods: {
            initView (data){
                this.isInitial = true;
                let length = data.log.length;
                if (length) {
                    this.$store.commit('addLogs', data.log);
                    this.updateDownTime(data.log[0].time);
                    this.updateUpTime(data.log[length - 1].time);
                }
            },
            getInitialData (callback){
                this.getDeviceLog(this.ptr_down_time, 'down', (data) => {
                    this.$store.commit('resetLogs');
                    this.initView(data);
                    callback(data);
                }, () => {
                    this.isInitial = true;
                });
            },
            updateDownTime (time){
                if (time < this.ptr_down_time) {
                    this.$store.commit('updateDownTime', time)
                }
            },
            updateUpTime(time){
//                if (time > this.ptr_up_time) {
                this.$store.commit('updateUpTime', time)
//                }
            },
            getDeviceLog (time, direction, successCallback, errorCallback, items_per_page){
                items_per_page = items_per_page || 20;
                HdSmart.Device.postRequest('getDeviceLog', {
                    start_time: time,
                    direction: direction,
                    items_per_page: items_per_page
                }, (data) => {
                    let length = data.log.length;
                    if (length) {
                        data.log.sort(function (a, b) {
                            return a.time - b.time;
                        })
                    } else {
                        data.log = [];
                    }
                    if (direction == 'down' && length < items_per_page) {
                        this.moreData = false
                    }
                    successCallback(data);
                }, () => {
                    errorCallback();
                })
            },
            onPull (onPullFinishCallback){
                this.getDeviceLog(this.ptr_up_time, 'up', (data) => {
                    let length = data.log.length;
                    if (length) {
                        this.$store.commit('addLogs', data.log);
                        this.updateUpTime(data.log[length - 1].time);
                    }
                    onPullFinishCallback(true);
                }, () => {
                    onPullFinishCallback(false);
                });
            },
            onPush (onPushFinishCallback){
                this.getDeviceLog(this.ptr_down_time, 'down', (data) => {
                    if (data.log && data.log.length) {
                        this.$store.commit('addLogs', data.log);
                        this.updateDownTime(data.log[0].time);
                    }
                    onPushFinishCallback(true);
                }, () => {
                    onPushFinishCallback(false);
                });
            }
        }
    }
</script>
<style scoped lang="less">
    .log-list {
        width: 100%;
        position: relative;
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

    .log-panel:first-child > .log-header + .log-item {
        color: #13d5dc;
    }

    .no-more-item {
        font-size: 24px;
        color: #d2d2d2;
        text-align: center;
        margin-top: 36px;
    }

    .no-item {
        text-align: center;
        font-size: 30px;
        color: #d2d2d2;
    }

    .no-item:before {
        content: '';
        display: block;
        margin: 120px auto 36px auto;
        width: 360px;
        height: 360px;
        background: url('../assets/img_emptydata.png');
        background-size: 100% 100%;
    }
</style>
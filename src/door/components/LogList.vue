<template>
    <div class="log-list">
        <pull-to-refresh v-on:onPull="onPull" v-on:onPush="onPush">
            <div class="log-panel-group">
                <div class="log-panel">
                    <template v-for="daily in logDateList">
                        <div class="log-indicator log-header">
                            <div class="log-indicator-circle"></div>
                            {{daily.timestamp | tf}}
                        </div>
                        <div class="log-indicator log-item" v-for="log in logsInDate[daily.day].logs">
                            <div class="log-indicator-circle"></div>
                            <div class="time">{{log.timeTxt}}</div>
                            <div class="status">{{log.attr.status == 'on'?'打开':'关闭'}}</div>
                        </div>
                    </template>
                </div>
            </div>
        </pull-to-refresh>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    export default {
        mounted (){
            this.getDeviceLog(this.ptr_down_time, 'down', (data) => {
                let length = 0;
                if (data.log && (length = data.log.length)) {
                    this.$store.commit('addLogs', data.log);
                    this.updateDownTime(data.log[0].time);
                    this.updateUpTime(data.log[length - 1].time);
                }
            }, 16);
            this.$store.watch(()=>{
            })
        },
        computed: mapState(['ptr_down_time', 'ptr_up_time', 'logsInDate', 'logDateList']),
        methods: {
            updateDownTime (time){
                if (time < this.ptr_down_time) {
                    this.$store.commit('updateDownTime', time)
                }
            },
            updateUpTime(time){
                if (time > this.ptr_up_time) {
                    this.$store.commit('updateDownTime', time)
                }
            },
            getDeviceLog (time, direction, callback, items_per_page){
                HdSmart.Device.getDeviceLog({
                    start_time: time,
                    direction: direction,
                    items_per_page: items_per_page
                }, (data) => {
                    callback(data);
                })
            },
            onPull (onPullFinishCallback){
                console.log('pull')
                setTimeout(function () {
                    onPullFinishCallback();
                }, 2000)
            },
            onPush (onPushFinishCallback){
                this.getDeviceLog(this.ptr_down_time, 'down', (data) => {
                    let length = 0;
                    if (data.log && (length = data.log.length)) {
                        this.$store.commit('addLogs', data.log);
                        this.updateDownTime(data.log[length - 1].time);
                        onPushFinishCallback();
                    }
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
        background: red;
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

    .log-indicator:before {
        position: absolute;
        content: '';
        width: 2px;
        height: 50%;
        left: -22px;
        top: 50%;
        background: #dbdbdb;
    }

    .log-indicator + .log-indicator:before {
        top: 0;
        height: 100%;
    }

    .log-indicator:last-child:before {
        top: 0;
        height: 50% !important;
    }
</style>
<template>
    <div class="container" ref="container">
        <log-title :device="device"></log-title>
        <log-list class="list" :is_ready="is_ready"></log-list>
        <log-tool :is_ready="is_ready"></log-tool>
    </div>
</template>


<style lang="less" scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 780px;
        margin: 0 auto;
        position: absolute;
        top: 120px;
        bottom: 224px;
        left: 0;
        right: 0;
    }

    .list {
        flex: 1;
    }
</style>
<script>
    import {mapState} from 'vuex';
    import {get_cache,save_cache} from './helper';
    export default {
        data (){
            return {
                is_ready: false,
                device: {
                    title: get_cache('title') || '门窗传感器',
                    status: '',
                    power_status: ''
                }
            }
        },
        computed: mapState(['ptr_up_time', 'ptr_down_time']),
        name: 'app',
        mounted (){
            HdSmart.ready(()=>{
                HdSmart.Device.getSnapShot((data, service_time) => {
                    HdSmart.UI.hideLoading();
                    this.is_ready = true;
                    this.device.title = '门窗传感器';
                    this.device.status = data.attr.status;
                    this.device.power_status = data.attr.alarm_low_battery;
                    service_time = service_time * 1000;
                    this.$store.commit('updateDownTime', service_time);
                    this.$store.commit('updateUpTime', service_time);
                    this.$store.commit('updateSourceTime', service_time);
                    save_cache('title',this.device.title);
                }, () => {
                    this.is_ready = true;
                    HdSmart.UI.hideLoading();
                });
                HdSmart.onDeviceListen((data) => {
                    this.device.status = data.result.attr.status;
                    this.device.power_status = data.result.attr.alarm_low_battery;
                    this.$store.commit('addLogs', [{
                        time: data.result.timestamp,
                        attr: Object.assign({}, data.result.attr, {
                            type: 'add'
                        })
                    }]);
                });

                HdSmart.UI.setWebViewTouchRect(0, 0, '100%', '100%');
            })
        }
    }
</script>

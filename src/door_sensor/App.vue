<template>
    <div class="container" ref="container">
        <log-title :device="device"></log-title>
        <log-list class="list" v-if="is_ajax_back"></log-list>
        <log-tool v-if="is_ajax_back"></log-tool>
    </div>
</template>


<style lang="scss" scoped>
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
    export default {
        data (){
            return {
                is_ajax_back: false,
                device: {
                    title: '',
                    status: 'off',
                    power_status: 'off'
                }
            }
        },
        computed: mapState(['ptr_up_time', 'ptr_down_time']),
        name: 'app',
        mounted (){
            HdSmart.Device.getSnapShot((data, service_time) => {
                HdSmart.UI.hideLoading();
                this.is_ajax_back = true;
                this.device.title = '门窗传感器';
                this.device.status = data.attr.status;
                this.device.power_status = data.attr.alarm_low_battery;
                service_time = service_time * 1000;
                this.$store.commit('updateDownTime', service_time);
                this.$store.commit('updateUpTime', service_time);
                this.$store.commit('updateSourceTime', service_time);
                this.$nextTick(() => {
                    let rect = this.$refs.container.getBoundingClientRect();
                })
            }, () => {
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
        }
    }
</script>

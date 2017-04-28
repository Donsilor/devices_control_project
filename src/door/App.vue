<template>
    <div v-if="is_ajax_back" class="container">
        <log-title :device="device"></log-title>
        <log-list class="list"></log-list>
        <log-tool></log-tool>
    </div>
</template>


<style lang="scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 780px;
        margin: 0 auto;
        padding-top: 120px;
        height: 100%;
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
                    status: 'off'
                }
            }
        },
        computed: mapState(['ptr_up_time', 'ptr_down_time']),
        name: 'app',
        mounted (){
            HdSmart.Device.getSnapShot((data, service_time) => {
                this.is_ajax_back = true;
                this.device.title = '门'+window.device_uuid;
                this.device.status = data.attr.status;
                this.$store.commit('updateDownTime', service_time);
                this.$store.commit('updateUpTime', service_time);
            });
            HdSmart.onDeviceListen((data)=>{
                alert(data);
            })
        }
    }
</script>

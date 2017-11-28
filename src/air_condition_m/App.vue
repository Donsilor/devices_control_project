<template>
<div class="wrap">
    <page-on
        v-if="status==='SUCCESS' && ac.switchStatus==='on'"
        :control="controlDevice"
        :device="device"
        :ac="ac"
        ref="airon" />
    <page-off
        v-if="status==='SUCCESS' && ac.switchStatus==='off'"
        :control="controlDevice"
        :device="device" />
    <page-error
        v-if="status==='ERROR'"
        :reload="init" />
</div>
</template>

<script>
import PageOn from './components/PageOn.vue'
import PageOff from './components/PageOff.vue'
import PageError from './components/PageError.vue'

const DefaultSpin = require('./assets/buffering_power_white.gif')
const BlueSpin = require('./assets/buffering_power_blue.gif')

export default {
    components: {
        'page-on': PageOn,
        'page-off': PageOff,
        'page-error': PageError
    },
    data() {
        return {
            status: '', //SUCCESS,ERROR
            ac: {
                'temperature': 0, //[16,30]
                'switchStatus': '', //on,off(发送指令为switch)
                'mode': '', //auto,cold,heat,dehumidify,wind
                'speed': '', //low,normal,high,auto
                'wind_up_down': '', //on,off
                'wind_left_right': '', //on,off
            },
            device: {}
        }
    },
    methods: {
        showSpin(ele, style) {
            if(!ele){
                return
            }
            this.removeSpin()
            this.loadingDelay = setTimeout(()=>{
                this.spinner = document.createElement('img')
                this.spinner.style.width = '100%'
                this.spinner.style.height = '100%'
                this.spinner.src = style==='blue' ? BlueSpin : DefaultSpin
                this.loadingEl = ele
                this.loadingEl.appendChild(this.spinner)
            }, 600)
        },
        removeSpin() {
            clearTimeout(this.loadingDelay)
            if(this.spinner){
                this.loadingEl.removeChild(this.spinner)
                this.spinner = null
            }
        },
        controlDevice(attr, val, target, success, error) {
            if(this.ac[attr]===val){
                return
            }
            var style = 'default'
            if(attr==='switch' && val==='on'){
                style = 'blue'
            }else if((attr==='wind_up_down'||attr==='wind_left_right') && val==='on'){
                style = 'blue'
            }else if(attr==='mode' && (val==='auto' || val==='wind')){
                style = 'blue'
            }
            this.showSpin(target, style)
            HdSmart.Device.control({
                method: 'dm_set',
                nodeid: `airconditioner.main.${attr}`,
                params: {
                    attribute: {
                        [attr]: val
                    }
                }
            }, (res)=>{
                this.setAttr({
                    [attr]: val
                })
                this.removeSpin()
                success && success()
            }, ()=>{
                this.removeSpin()
                error && error()
            })
        },
        setAttr(attrs) {
            for(var p in attrs){
                this.ac[p==='switch'?'switchStatus':p] = attrs[p]
            }
        },
        init() {
            HdSmart.ready(()=>{
                HdSmart.UI.showLoading()
                this.getSnapShot()
            })
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot((res)=>{
                HdSmart.UI.hideLoading()
                this.onSuccess(res)
            },()=>{
                HdSmart.UI.hideLoading()
                this.onError()
            })
        },
        onSuccess(data) {
            if(data && data.attribute){
                if(data.attribute.operation === 'abnormal'){
                    this.onError()
                }else{
                    this.status = 'SUCCESS'
                    this.setAttr(data.attribute)
                    this.$nextTick(()=>{
                        this.$refs.airon.syncTemp()
                    })
                    if(!this.device.name){
                        this.device = {
                            name: data.device_name,
                            category_id: data.attribute.deviceSubCategory
                        }
                    }
                }
            }
        },
        onError() {
            this.status = 'ERROR'
        }
    },
    created() {
        HdSmart.onDeviceListen((res)=>{
            switch (res.method) {
                case 'dm_set':
                    if(res.code !== 0){
                        this.getSnapShot()
                    }
                    break
                default:
                    this.onSuccess(res.result)
                    break
            }
        })
        this.init()
    }
}
</script>

<style lang="less">
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
ul{
    list-style: none;
}
body{
    line-height: 1;
}
a{
    outline: none;
    -webkit-tap-highlight-color:transparent;
}
.wrap-off,.wrap-on,.wrap-error{
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
</style>



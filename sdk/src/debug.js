import bridge from './bridge/socket'
import {on, off, trigger} from './event'
import {apiList} from './constant'
import {guid, getDeviceUUID, getToken} from './helper'

bridge.io.on('connect',function(){
    console.log('ready')
    if(!bridge.isReady){
        trigger(apiList.ready)
        bridge.isReady = true
    }
})

window.HdSmart = {
    ready: function(callback){
        if(bridge.isReady){
            callback()
        }else{
            on(apiList.ready, callback)
        }
    },
    onDeviceListen: function(callback){
        bridge.io.on(apiList.device_change, callback)
    },
    Device: {
        getSnapShot: function(callback){
            bridge.send(apiList.device_getsnapshot, '', callback)
        },
        control: function(options, onSuccess, onFailure){

            const dataOptions = Object.assign({
                req_id: guid(),
                timestamp: Date.now(),
                params: {}
            }, options)

            if(options.nodeid){
                dataOptions.token = getToken()
            }

            dataOptions.params.device_uuid = getDeviceUUID()

            bridge.send(apiList.device_control, dataOptions, function(data){
                //空调
                if(options.nodeid){
                    if (data.code === 0) {
                        onSuccess(data)
                    } else{
                        onFailure(data)
                    }
                }else{
                    if (data.code === 504) {
                        onFailure(data)
                    } else {
                        onSuccess(data)
                    }
                }
            })
        }
    }
}

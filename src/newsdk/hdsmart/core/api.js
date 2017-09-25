import {
    guid,
    noop,
    getDeviceUUID,
    getDeviceName,
    getDeviceCategory,
    getToken,
    covertToNumber
} from '../helper'

import {
    on,
    off,
    trigger,
} from '../event'

import {
    apiList,
    tipMsg,
} from '../constant'

let bridge = {}

const api = {
    init (e){
        bridge = e
    },
    //System
    ready (callback){
        if(bridge.isReady){
            callback()
        }else{
            on(apiList.ready, callback)
        }
    },
    onDeviceListen (callback){
        bridge.registerHandler(apiList.device_change, data=>callback(data))
    }
}

//Device
//todo: 这两个方法需要合并
//api.Device.instruct = api.Device.control
api.Device = {
    control (method, command, attribute, onSuccess, onFailure, timeout = 8000){
        const dataOptions = {
            method: method,
            req_id: guid(),
            timestamp: Date.now(),
            params: {
                device_uuid: getDeviceUUID(),
                cmd: command,
                attribute: attribute
            }
        }

        // 设置timer
        let isTimeout = false
        let timer = setTimeout(() => {
            isTimeout = true
            onFailure()
        }, timeout)

        bridge.send(apiList.device_control, dataOptions, (data)=>{
            if (isTimeout) {
                return false
            }

            clearTimeout(timer)

            if (data.code === 0) {
                onSuccess(data)
            } else{
                onFailure(data)
            }
        })
    },
    instruct(method, nodeId, attr, onSuccess, onFailure, timerObj = null, timeout = 8000) {
        const dataOptions = {
            method: method,
            req_id: guid(),
            token: getToken(),
            nodeid: nodeId,
            timestamp: Date.now(),
            params: {
                device_uuid: getDeviceUUID(),
                timer: timerObj,
                attribute: attr
            }
        }

        // set timer
        let isTimeout = false
        let timer = setTimeout(() => {
            isTimeout = true
            onFailure()
        }, timeout)

        bridge.send(apiList.device_control, dataOptions, (data) => {
            if (isTimeout) {
                return false
            }

            clearTimeout(timer)

            if (data.code === 0){
                onSuccess(data)
            }else{
                onFailure(data)
            }
        })
    },
    getSnapShot (onSuccess, onFailure){
        bridge.send(apiList.device_getsnapshot, '', (data) => {
            if (data.code === 0){
                onSuccess(data.result, data.timestamp || data.result.timestamp)
            } else {
                onFailure(data)
            }
        })
    },
    postRequest (method, params, onSuccess, onFailure){
        const dataOptions = {
            method: method,
            req_id: guid(),
            params: {
                ...params,
                device_uuid: getDeviceUUID()
            }
        }

        bridge.send(apiList.device_postrequest, dataOptions, (data)=>{
            if(data.code === 504){
                onFailure(data)
            }else{
                onSuccess(data)
            }
        })
    },
}

//UI
api.UI = {
    alert(title, message, onSuccess, okText = '确定', cancelText = '取消') {
        bridge.send(apiList.ui_alert, {title, message, okText, cancelText}, onSuccess)
    },
    showLoading() {
        bridge.send(apiList.ui_showloading)
    },
    hideLoading() {
        bridge.send(apiList.ui_hideloading)
    },
    setWebViewTouchRect (left, top, right, bottom){
        var rect = document.body.getBoundingClientRect()
        left = covertToNumber(left, rect.width)
        top = covertToNumber(top, rect.height)
        right = covertToNumber(right, rect.width)
        bottom = covertToNumber(bottom, rect.height)

        const dataOptions = {
            left,
            right,
            top,
            bottom,
        }
        bridge.send(apiList.ui_settouchrect, dataOptions)
    },
    toast (message, duration = 3000){
        bridge.send(apiList.ui_toast, {message, duration})
    },
    toggleHeadAndFoot (visible){
        bridge.send(apiList.ui_toggleheadandfoot, {show_head_foot: visible})
    },
}

//Util
api.Util = {
    dispatchEvent (params, callback){
        bridge.send(apiList.util_dispatchevent, params, (data)=>{

            var error = null
            if(typeof data === 'string'){
                //HACK: app返回json数据有问题，没找到解决方案
                try{
                    data = JSON.parse(data)
                }catch(e){
                    try{
                        data = data.replace(/\n/g,'\\n');
                        data = data.replace(/:"([^{[]*?)("[,}])/g,function(match,v,q){
                            return ':"' + v.replace(/"/g,'\\"') + q;
                        });
                        data = JSON.parse(data)
                    }catch(e){
                        error = {
                            errormsg: tipMsg.jsonerr
                        }
                    }
                }
            }else if(typeof data === 'undefined'){
                data = {}
            }

            if(data.code === 504){
                error = {
                    errormsg: tipMsg.e504
                }
            }

            callback && callback(error, data)

        }, false)
    },
    getNetworkType (onSuccess){
        bridge.send(apiList.util_getnetworktype, '', (data)=>{
            onSuccess(data)
        }, false)
    },
    post (){
        console.log('暂不实现')
    },
    reload (){
        bridge.send(apiList.util_reload)
    },
    sendNotification (title, message){
        bridge.send(apiList.util_sendnotification, {title, message})
    },
}

export default api

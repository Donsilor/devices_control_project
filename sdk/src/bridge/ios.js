import {
    on,
    off,
    trigger,
} from '../event'

import { apiList } from '../constant'

const noop = ()=>{}

const bridge = {

    isReady: false,

    init (e){
        window.onDeviceJsReady = function(){
            trigger(apiList.ready)
            bridge.isReady = true
        }

        window.onDeviceChange = function(data){
            trigger(apiList.device_change, data)
        }

    },

    send (method, data = '', callback = noop){
        if(!window.JSBridgeEventHandler) {
            console.error('window.JSBridgeEventHandler is not exist')
            return
        }
        console.log(`iOS call : ${method}`, data)
        JSBridgeEventHandler.callNativeFunction(method, data, callback);
    },

    registerHandler (method, callback){
        on(method, callback)
    }
}

export default bridge

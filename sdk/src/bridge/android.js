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

    send (method, data = '', callback = noop, autoParseResponse = true){
        if(!window.HdIot) {
            console.error('window.HdIot is not exist')
            return
        }
        console.log(`android call : ${method}`, data)
        try{
            const fn = method.split('.').reduce((fn, method)=>{
                return fn[method]
            }, HdIot)

            fn({
                data: JSON.stringify(data),
                onListener(response) {
                    if(autoParseResponse){
                        callback(JSON.parse(response))
                    }else{
                        callback(response)
                    }
                }
            })
        }catch(e){
            console.error(`HdIot.${method} error :`, e)
        }
    },

    registerHandler (method, callback){
        on(method, callback)
    }
}

export default bridge

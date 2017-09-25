import {
    on,
    off,
    trigger,
} from '../event'

import {
    apiList,
    tipMsg,
} from '../constant'

const noop = ()=>{}

const bridge = {

    isReady: false,

    init (e){},

    send (method, data = '', callback = noop, autoParseResponse = true){
        if(!window.HdIot) {
            console.error('window.HdIot is not exist')
            return
        }
        if(!method){
            console.error('method is require')
            return
        }
        try{
            console.log(`%cHdIot.${method} called success :`, 'background:#aaa;color:green', data)
            const fn = method.split('.').reduce((fn, method)=>{
                return fn[method]
            }, HdIot)

            fn({
                data: JSON.stringify(data),
                onListener(response) {
                    console.log(`HdIot.${method} callback :`)
                    if(autoParseResponse){
                        try{
                            let json = JSON.parse(response)
                            console.log(json)
                            callback(json)
                        }catch(e){
                            console.error(`json parse error`)
                        }
                    }else{
                        console.log(response)
                        callback(response)
                    }
                }
            })
        }catch(e){
            console.error(`HdIot.${method} error :`, e)
        }
    },

    registerHandler (method, callback){
        on(method, (data)=>{
            console.log(`%c${method} from app:`, 'background:#aaa;color:yellow', data)
            callback(data)
        })
    }
}

window.onDeviceJsReady = function(){
    trigger(apiList.ready)
    bridge.isReady = true
}

window.onDeviceChange = function(data){
    trigger(apiList.device_change, data)
}

export default bridge

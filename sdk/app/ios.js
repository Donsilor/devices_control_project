import {
    on,
    off,
    trigger,
} from '../src/event'

export default {
    $init(){
        window.JSBridgeEventHandler = {
            callNativeFunction: function(method, params, callback){
                params = params || {}
                if(callback){
                    var callbackName = method + '_callback_' + Date.now()
                    params.callbackName = callbackName
                    on(callbackName, callback)
                }
                trigger(method, params)
            }
        }
    },
    $on(method, callback){
        method = method.replace(/\w+\./,'')
        on(method, function(params){
            var callbackName = params.callbackName
            var next = function(response){
                if(callbackName){
                    setTimeout(()=>{
                        trigger(callbackName, response)
                    },1000)
                }
            }
            callback(params, next)
        })
    }

}

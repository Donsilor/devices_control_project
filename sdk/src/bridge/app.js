
const ua = navigator.userAgent
const isAndroid = /android/i.test(ua)
const isIOS = /iphone|ipad/i.test(ua)

const noop = () => {}

const androidCall = (method, data = '', callback = noop, autoParseResponse = true) => {
    if(!window.HdIot) {
        throw new Error('HdIot is not exist')
    }
    console.log(`android call : ${method}`, data)
    try{
        const fn = method.split('.').reduce((fn, method)=>{
            return fn[method]
        }, HdIot)

        let options = {
            data: JSON.stringify(data),
            onListener(response) {
                if(autoParseResponse){
                    callback(JSON.parse(response))
                }else{
                    callback(response)
                }
            }
        }

        if(method === 'UI.toast'){
            options = JSON.stringify({data})
        }

        fn(options)
    }catch(e){
        console.error(`HdIot.${method} error :`, e)
    }
}

const iOSCall = (method, data = '', callback = noop) => {
    if(!window.JSBridgeEventHandler) {
        throw new Error('JSBridgeEventHandler is not exist')
    }
    console.log(`iOS call : ${method}`, data)
    JSBridgeEventHandler.callNativeFunction(method, data, callback)
}

export default {
    isReady: false,
    send: isIOS ? iOSCall : androidCall
}

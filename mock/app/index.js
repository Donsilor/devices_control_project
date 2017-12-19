
import iOSCore from './ios'
import androidCore from './android'
import {apiList} from './constant'

const ua = navigator.userAgent
const isAndroid = /android/i.test(ua)
const isIOS = /iphone|ipad/i.test(ua)
let $on

if(isIOS){
    iOSCore.$init()
    $on = iOSCore.$on
}else{
    androidCore.$init()
    $on = androidCore.$on
}

for(var key in apiList){
    $on(apiList[key],()=>{})
}

setTimeout(()=>{
    onDeviceJsReady()
},200)

export default $on

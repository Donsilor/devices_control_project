
import api from './core/api'
import AndroidBridge from './bridge/android'
import IOSBridge from './bridge/ios'

const ua = navigator.userAgent
const isAndroid = /android/i.test(ua)
const isIOS = /iphone|ipad/i.test(ua)

let bridge = AndroidBridge
if(isIOS){
    bridge = IOSBridge
}

api.init(bridge)

window.HdSmart = api

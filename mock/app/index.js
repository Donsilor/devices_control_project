import iOSCore from './ios'
import androidCore from './android'
import { apiList } from './constant'

const ua = navigator.userAgent
// const isAndroid = /android/i.test(ua)
const isIOS = /iphone|ipad/i.test(ua)
let $on

if (isIOS) {
    iOSCore.$init()
    $on = iOSCore.$on
} else {
    androidCore.$init()
    $on = androidCore.$on
}

if (argv_is_mock || location.search.indexOf('env=desktop') != -1) {
    for (var key in apiList) {
        $on(apiList[key], () => {})
    }
    $on(apiList.ui_alert, function(data, done) {
        alert(data.message)
        done({})
    })
    setTimeout(() => {
        onDeviceJsReady()
    }, 200)
}

export default $on

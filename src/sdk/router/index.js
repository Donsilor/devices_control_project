import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Ready from '../components/api/Ready'
import OnDeviceListen from '../components/api/OnDeviceListen'
import Control from '../components/api/Control'
import GetSnapShot from '../components/api/GetSnapShot'
import GetDeviceLog from '../components/api/GetDeviceLog'
import GetDeviceMonthHistory from '../components/api/GetDeviceMonthHistory'
import Alert from '../components/api/Alert'
import Toast from '../components/api/Toast'
import Loading from '../components/api/Loading'
import GetNetworkType from '../components/api/GetNetworkType'
import Reload from '../components/api/Reload'
import Post from '../components/api/Post'
import SendNotification from '../components/api/SendNotification'
import SetWebViewTouchRect from '../components/api/SetWebViewTouchRect.vue'
import GetDeviceLogByDay from '../components/api/GetDeviceLogByDay.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main
        },
        {
            path: '/api/ready',
            name: 'ready',
            component: Ready
        },
        {
            path: '/api/onDeviceListen',
            name: 'onDeviceListen',
            component: OnDeviceListen
        },
        {
            path: '/api/device/control',
            name: 'control',
            component: Control
        },
        {
            path: '/api/device/getSnapShot',
            name: 'getSnapShot',
            component: GetSnapShot
        },
        {
            path: '/api/device/getDeviceLog',
            name: 'getDeviceLog',
            component: GetDeviceLog
        },
        {
            path: '/api/device/getDeviceLogByDay',
            name: 'getDeviceLogByDay',
            component: GetDeviceLogByDay
        },
        {
            path: '/api/device/getDeviceMonthHistory',
            name: 'getDeviceMonthHistory',
            component: GetDeviceMonthHistory
        },
        {
            path: '/api/ui/alert',
            name: 'alert',
            component: Alert
        },
        {
            path: '/api/ui/toast',
            name: 'toast',
            component: Toast
        },
        {
            path: '/api/ui/setWebViewTouchRect',
            name: 'SetWebViewTouchRect',
            component: SetWebViewTouchRect
        },
        {
            path: '/api/ui/loading',
            name: 'loading',
            component: Loading
        },
        {
            path: '/api/util/getNetworkType',
            name: 'getNetworkType',
            component: GetNetworkType
        },
        {
            path: '/api/util/reload',
            name: 'reload',
            component: Reload
        },
        {
            path: '/api/util/post',
            name: 'post',
            component: Post
        },
        {
            path: '/api/util/sendNotification',
            name: 'sendNotification',
            component: SendNotification
        }
    ]
})

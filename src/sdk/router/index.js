import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'

//System
import Ready from '../components/api/Ready'
import OnDeviceListen from '../components/api/OnDeviceListen'
//Device
import Control from '../components/api/Control'
import GetSnapShot from '../components/api/GetSnapShot'
import PostRequest  from '../components/api/postRequest.vue';
//UI
import Alert from '../components/api/Alert'
import Toast from '../components/api/Toast'
import Loading from '../components/api/Loading'
import SetWebViewTouchRect from '../components/api/SetWebViewTouchRect.vue'
import ToggleHeadAndFoot from '../components/api/ToggleHeadAndFoot.vue'
//Util
import GetNetworkType from '../components/api/GetNetworkType'
import Reload from '../components/api/Reload'
import Post from '../components/api/Post'
import SendNotification from '../components/api/SendNotification'

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
            path: '/api/device/postRequest',
            name: 'postRequest',
            component: PostRequest
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
            path: '/api/ui/toggleHeadAndFoot',
            name: 'toggleHeadAndFoot',
            component: ToggleHeadAndFoot
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

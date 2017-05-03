<template>
    <ul class="list-group">
        <li class="list-group-item-heading">
            <h3>页面初始化</h3>
        </li>
        <li class="list-group-item">
            <router-link to="/api/ready">HdSmart.ready => (app相关api - window.onDeviceJsReady)</router-link>
        </li>
        <li class="list-group-item-heading">
            <h3>设备变更事件</h3>
        </li>
        <li class="list-group-item">
            <router-link to="/api/onDeviceListen">HdSmart.onDeviceListen => (app相关api:window.onDeviceReady)
            </router-link>
        </li>
        <li class="list-group-item-heading">
            <h3>Device</h3>
        </li>
        <li class="list-group-item">
            <router-link to="/api/device/control">HdSmart.Device.control => (app相关api:HdIot.Device.control)
            </router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/device/getSnapShot">HdSmart.Device.getSnapShot =>
                (app相关api:HdIot.Device.getSnapShot)
            </router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/device/getDeviceLog">HdSmart.Device.getDeviceLog =>
                (app相关api:HdIot.Device.getDeviceLog)
            </router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/device/getDeviceLogByDay">HdSmart.Device.getDeviceLogByDay =>
                (app相关api:HdIot.Device.getDeviceLogByDay)
            </router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/device/getDeviceMonthHistory">HdSmart.Device.getDeviceMonthHistory =>
                (app相关api:HdIot.Device.getDeviceMonthHistory)
            </router-link>
        </li>
        <li class="list-group-item-heading">
            <h3>UI</h3>
        </li>
        <li class="list-group-item">
            <router-link to="/api/ui/alert">HdSmart.UI.Alert => (app相关api:HdIot.UI.Alert)</router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/ui/toast">HdSmart.UI.Toast => (app相关api:HdIot.UI.Toast)</router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/ui/setWebViewTouchRect">HdSmart.UI.setWebViewTouchRect => (app相关api:HdIot.UI.setTouchRect)</router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/ui/loading">loading (HdSmart.UI.showLoading-HdSmart.UI.hideLoading)=>
                (app相关api:HdIot.UI.showLoading-HdIot.UI.hideLoading)
            </router-link>
        </li>
        <li class="list-group-item-heading">
            <h3>Util</h3>
        </li>
        <li class="list-group-item">
            <router-link to="/api/util/getNetworkType">HdSmart.Util.getNetworkType =>
                (app相关api:HdIot.Util.getNetworkType)
            </router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/util/reload">HdSmart.Util.reload => (app相关api:HdIot.Util.reload)</router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/util/post">HdSmart.Util.post => (app相关api:HdIot.Util.post)</router-link>
        </li>
        <li class="list-group-item">
            <router-link to="/api/util/sendNotification">HdSmart.Util.sendNotification => (app相关api:HdIot.Util.sendNotification)</router-link>
        </li>
    </ul>
</template>
<script>
    export default {
        name: "main"
    };
</script>
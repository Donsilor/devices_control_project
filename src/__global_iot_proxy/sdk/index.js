import {isDesktopEnv} from './helper';
import Device from './device/index';
import UI from './ui/index';
import Util from './util/index'
if (isDesktopEnv()) {
    window.HdIot = {
        Device:Device,
        UI:UI,
        Util:Util
    };
    /**
     *  设备的device_uuid，由app注入到webView的全局变量中。在桌面测试时，此值为abc123
     *  @member device_uuid
     */
    window.device_uuid = 'abc123';
    /**
     * 桌面测试专用,setTimeout定时器id,默认在0.5秒后启动，可clearTimeout此值，重新设定启动时刻
     * @member deviceReadyTimer
     */
    window.deviceReadyTimer = setTimeout(function () {
        window.onDeviceJsReady();
    }, 2000);
}

if (window.HdSmart) {
    HdSmart.ready(function () {
        console.log('<--- device_uuid log begin ---');
        console.log('device_uuid:' + device_uuid);
        console.log('--- device_uuid log end --->');
    });
}
//todo 需要确定是页面先加载还是HdIot先注入来确定100ms的延迟在app端是否需要。
import {
    ready,
    beforeReady,
    runReadyCallbacks
} from './ready';
import {
    onDeviceListen,
    runDeviceListenCallback
} from './onDeviceListen';

/**
 * @module System
 */
export default {
    ready,
    beforeReady,
    runReadyCallbacks,
    onDeviceListen,
    runDeviceListenCallback
}
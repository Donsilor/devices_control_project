import {isFunction, log} from '../helper';
let callbacks = [];
export function onDeviceListen(callback) {
    if (isFunction(callback)) {
        callbacks.push(callback);
    }
}

export function runDeviceListenCallback(data) {
    log('onDeviceListen', '', data)
    callbacks.forEach((callback) => {
        callback(data);
    });
}
import {isFunction} from '../helper';
let is_ready = false;
let callbacks = [];
export function ready(callback) {
    if (isFunction(callback)) {
        callback();
    }
}

export function beforeReady(callback) {
    if (isFunction(callback)) {
        callbacks.push(callback);
    }
}

export function runReadyCallbacks() {
    callbacks.forEach((callback) => {
        callback();
    });
    callbacks = [];
}
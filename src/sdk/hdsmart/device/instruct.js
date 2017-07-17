/**
 * Created by lenovo on 2017/6/29.
 */
/**
 * Created by lenovo on 2017/6/29.
 */
import {guid, getDeviceUUID, getToken, log, isFunction} from '../helper';
/**
 * 发送设备的控制命令
 * @function instruct
 * @memberOf module:Device
 * @param {string} method 方法名
 * @param {string} nodeId 节点ID
 * @param {object} attr 属性
 * @param {function} onSuccess 成功回调函数
 * @param {function} onFailure 失败回调函数
 *  @param {object} timerObj 定时器
 * @param {number} timeout=8000 超时时间
 *
 * @return {number} 返回定时器id
 * @example
 * HdSmart.Device.instruct('method','nodeId',attr,function(data){
 *      //data为控制成功后设备返回的状态
 * },function(error){
 *      //控制失败
 * },3000);
 *
 */
export default function (method, nodeId, attr, onSuccess, onFailure, timerObj = null, timeout) {
    // construct request data
    let dataOptions = JSON.stringify({
        method: method,
        req_id: guid(),
        token: getToken(),
        nodeid: nodeId,
        params: {
            device_uuid: getDeviceUUID(),
            timer: timerObj,
            attr: attr
        }
    });
    // debugger

    // set timer
    let isTimeout = false;
    let timer = setTimeout(() => {
        isTimeout = true;
        log('control', '', {result: "超时"});
        onFailure();
    }, timeout || 8000);

    HdIot.Device.control({
        data: dataOptions,
        onListener: function (data) {
            if (isTimeout) {
                return false;
            }
            clearTimeout(timer);

            log('control', dataOptions, data);
            data = JSON.parse(data);

            if (typeof data.code === "number") {
                onFailure(data);
            } else if (isFunction(onSuccess)) {
                onSuccess();
            }
            // if (data.code == 200) {
            //     if(isFunction((onSuccess))){
            //         onSuccess(data);
            //     }
            // }
            // else{
            //     onFailure(data);
            // }

            // if(isFunction((onSuccess))){
            //     onSuccess(data);
            // }
        }
    });
    return timer;
};

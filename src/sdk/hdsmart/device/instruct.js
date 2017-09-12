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
//TODO:等硬件接口统一以后需要与control合并，并将相应的api进行更改
export default function (method, nodeId, attr, onSuccess, onFailure, timerObj = null, timeout) {
    // construct request data
    let dataOptions = JSON.stringify({
        method: method,
        req_id: guid(),
        token: getToken(),
        nodeid: nodeId,
        timestamp: Date.now(),
        params: {
            device_uuid: getDeviceUUID(),
            timer: timerObj,
            attribute: attr
        }
    });

    //处理成功code
    const SUCCESS_CODE = 0;

    // set timer
    let isTimeout = false;
    let timer = setTimeout(() => {
        isTimeout = true;
        log('control', '', {result: "超时"});
        onFailure();
    }, timeout || 8000);

    console.log('>>>开始调用HdIot.Device.control：' + HdIot.Device.control);
    HdIot.Device.control({
        data: dataOptions,
        onListener: function (data) {
            if (isTimeout) {
                return false;
            }
            clearTimeout(timer);

            // alert(data);
            log('control', dataOptions, data);
            data = JSON.parse(data);

            if (data.code == SUCCESS_CODE) {
                isFunction((onSuccess)) && onSuccess(data);
            }
            else{
                isFunction(onFailure) && onFailure(data);
            }
        }
    });
    return timer;
};

import {isFunction,log} from '../helper';


/**
 * 获取设备网络状态
 * @function getNetworkType
 * @memberOf module:Util
 * @author ive.chen
 * @param onSuccess {function} 回调函数中将会获得当前的网络类型
 * @example
 * HdSmart.Util.getNetworkType(function(type){
 *      //返回网络类型 type : wifi 4g 3g .etc
 * });
 */

export default function (onSuccess) {
    HdIot.Util.getNetworkType({
        data: '',
        onListener (data){
            log('getNetworkType', '', data);
            if(isFunction(onSuccess)){
                onSuccess(data)
            }
        }
    })
}
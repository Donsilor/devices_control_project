import bridge from '../bridge/app'
import {guid, getDeviceUUID, getToken} from '../helper'
import {apiList} from '../constant'

export default {
/**
     * 发送设备的控制命令
     * @function control
     * @memberOf module:Device
     * @param {string} method 控制的方法名
     * @param {string} command 控制的设备名
     * @param {object} attr 变更的属性名
     * @param {function} onSuccess 变更成功的回调函数
     * @param {function} onFailure 变更失败的回调函数
     * @param {number} timeout=8000 控制超时时间
     *
     * @return {number} 返回定时器id
     * @example
     * HdSmart.Device.control('method','cmd',attr,function(data){
     *      //data为控制成功后设备返回的状态
     * },function(error){
     *      //控制失败
     * },3000);
     *
     */
    control (options = {}, onSuccess, onFailure){
        const dataOptions = Object.assign({
            req_id: guid(),
            timestamp: Date.now(),
            params: {}
        }, options)

        if(options.nodeid){
            //dataOptions.token = getToken()
        }

        dataOptions.params.device_uuid = getDeviceUUID()
        dataOptions.params.user_id = window.user_id

        // 设置timer
        let isTimeout = false
        let timer = setTimeout(() => {
            isTimeout = true
            onFailure()
        }, 8000)

        bridge.send(apiList.device_control, dataOptions, (data)=>{
            if (isTimeout) {
                return false
            }

            clearTimeout(timer)

            //空调
            if(options.nodeid){
                if (data.code === 0) {
                    onSuccess(data)
                } else{
                    onFailure(data)
                }
            }else{
                if (data.code === 504) {
                    onFailure(data)
                } else {
                    onSuccess(data)
                }
            }
        })
    },
    /**
     * 获取设备当前快照
     * @function getSnapShot
     * @memberOf module:Device
     * @param {function} onSuccess 获取快照成功的回调函数
     * @param {function} onFailure 获取快照失败的回调函数
     * @example
     * HdSmart.Device.getSnapShot(function(data,service_time){
     *      //data为获取快照成功后返回的数据
     *      //service_time 服务器时间
     * },function(error){
     *      //返回失败的原因
     * });
     */
    getSnapShot (onSuccess, onFailure){
        bridge.send(apiList.device_getsnapshot, '', (data) => {
            if (data.code === 0){
                onSuccess(data.result, data.timestamp || data.result.timestamp)
            } else {
                onFailure(data)
            }
        })
    },
    /**
     * 获取设备的业务数据统一接口
     * @function postRequest
     * @memberOf module:Device
     * @param {string} method 要请求的业务数据的方法
     * @param {object} params 要请求的业务数据方法需要的参数
     * @param {function} onSuccess 当获取日志成功时的回调函数
     * @param {function} onFailure 当获取日志失败时的回调函数
     * @example
     * //获取设备日志
     * //使用设备：人体传感器 门窗传感器
     * HdSmart.Device.postRequest('getDeviceLog',{
     *          direction:'down',
     *          start_time: new Date(2017,5,10),
     *          page_number:1
     *      }，
     *      function(data){
     *          //data为请求数据成功后由设备端返回的数据
     *      },
     *      function(error){
     *          //
     *      }
     * })
     * @example
     * //获取时刻日志
     * //使用设备：温湿度传感器
     * HdSmart.Device.postRequest('getDeviceLogByDay',{
     *      start_date:+ new Date('2017-05-03 05:00:00')
     *  },function(data){
     *          //data为控制成功由设备端返回的数据
     * })
     * @example
     * //获取指定月份的有日志的日期
     * //使用设备：人体传感器，门窗传感器
     * HdSmart.Device.postRequest('getDeviceMonthHistory',year,month，
     *      function(data){
     *          //data为获取历史成功由设备端返回的数据
     *      }
     * })
     */
    postRequest (method, params, onSuccess, onFailure){
        const dataOptions = {
            method: method,
            req_id: guid(),
            params: {
                ...params,
                device_uuid: getDeviceUUID()
            }
        }

        bridge.send(apiList.device_postrequest, dataOptions, (data)=>{
            if(data.code === 504){
                onFailure(data)
            }else{
                onSuccess(data)
            }
        })
    },
}

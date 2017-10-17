import {
    guid,
    noop,
    getDeviceUUID,
    getDeviceName,
    getDeviceCategory,
    getToken,
    covertToNumber
} from '../helper'

import {
    on,
    off,
    trigger,
} from '../event'

import {
    apiList,
    tipMsg,
} from '../constant'

let bridge = {}

/**
 * todo:
 * api层级过多，不便记忆
 * 部分api重复(control和instruct)
 * 意义不明确(postRequest、dispatchEvent、post)
 * 设计不合理(toggleHeadAndFoot)
 * 缺少统一错误捕获
 */
const api = {
    init (e){
        bridge = e
        bridge.init()
    },
    /**
     * 当webView加载完成后，会执行此函数中的回调函数
     * @function ready
     * @memberOf module:System
     * @param {function} callback 执行的回调函数
     * @example
     * HdSmart.ready(function(){
     *      //当加载完成后会执行此处的函数
     * })
     */
    ready (callback){
        if(bridge.isReady){
            callback()
        }else{
            on(apiList.ready, callback)
        }
    },
    /**
     * 监听设备的上报，并执行回调函数
     * @function onDeviceListen
     * @memberOf module:System
     * @param {function} callback 当属性变更时的回调函数
     * @example
     * // 调用多次这个函数，会按顺序执行
     * HdSmart.onDeviceListen(function(data){
     *      // data为变更的设备属性值
     *      // 当设备属性变更时会执行此函数
     * })
     */
    onDeviceListen (callback){
        bridge.registerHandler(apiList.device_change, data=>callback(data))
    }
}

//Device
api.Device = {
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
    control (method, command, attribute, onSuccess, onFailure, timeout = 8000){
        const dataOptions = {
            method: method,
            req_id: guid(),
            timestamp: Date.now(),
            params: {
                device_uuid: getDeviceUUID(),
                cmd: command,
                attribute: attribute
            }
        }

        // 设置timer
        let isTimeout = false
        let timer = setTimeout(() => {
            isTimeout = true
            onFailure()
        }, timeout)

        bridge.send(apiList.device_control, dataOptions, (data)=>{
            if (isTimeout) {
                return false
            }

            clearTimeout(timer)

            if (data.code === 0) {
                onSuccess(data)
            } else{
                onFailure(data)
            }
        })
    },
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
    instruct(method, nodeId, attr, onSuccess, onFailure, timerObj = null, timeout = 8000) {
        const dataOptions = {
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
        }

        // set timer
        let isTimeout = false
        let timer = setTimeout(() => {
            isTimeout = true
            onFailure()
        }, timeout)

        bridge.send(apiList.device_control, dataOptions, (data) => {
            if (isTimeout) {
                return false
            }

            clearTimeout(timer)

            if (data.code === 0){
                onSuccess(data)
            }else{
                onFailure(data)
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
            params: Object.assign(params, {
                device_uuid: getDeviceUUID()
            })
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

//UI
api.UI = {
    /**
     * 调用源生弹出框
     * @function alert
     * @memberOf module:UI
     * @author ive.chen
     * @param {string} title  弹出框的标题
     * @param {string} message  弹出框的消息
     * @param {function} onSuccess  弹出框的点击'确定'按钮的回调函数
     * @param {string} [okText=确定]  弹出框'确定'按钮的文本
     * @param {string} [cancelText=取消]  弹出框'取消'按钮的文本
     * @example
     * HdSmart.UI.alert(title,message,function(){
     *      //点击确定的执行函数
     * },'确定','取消');
     */
    alert(title, message, onSuccess, okText = '确定', cancelText = '取消') {
        bridge.send(apiList.ui_alert, {title, message, okText, cancelText}, onSuccess)
    },
    /**
     * 显示源生loading
     * @function showLoading
     * @memberOf module:UI
     * @author ive.chen
     * @example
     * HdSmart.UI.showLoading();
     */
    showLoading() {
        bridge.send(apiList.ui_showloading)
    },
    /**
     * 隐藏源生loading
     * @function hideLoading
     * @memberOf module:UI
     * @example
     * HdSmart.UI.hideLoading();
     */
    hideLoading() {
        bridge.send(apiList.ui_hideloading)
    },
    /**
     * 允许webView 点击使用js来进行touch事件的区域
     * @function setWebViewTouchRect
     * @memberOf module:UI
     * @param {number | percentage} x1 区域左上角的坐标x轴
     * @param {number | percentage} y1 区域左上角的坐标y轴
     * @param {number | percentage} x2 区域右下角的坐标x轴
     * @param {number | percentage} y2 区域右下角的坐标y轴
     * @example
     * //当值为数字是单位为px
     * HdSmart.UI.setWebViewTouchRect(0,0,50,50);
     * //当值为百分比时，会根据屏幕的宽高和百分比值转为实际像素
     * HdSmart.UI.setWebViewTouchRect(0,0.'50%','50%')
     */
    setWebViewTouchRect (left, top, right, bottom){
        var rect = document.body.getBoundingClientRect()
        left = covertToNumber(left, rect.width)
        top = covertToNumber(top, rect.height)
        right = covertToNumber(right, rect.width)
        bottom = covertToNumber(bottom, rect.height)

        const dataOptions = {
            left,
            right,
            top,
            bottom,
        }
        bridge.send(apiList.ui_settouchrect, dataOptions)
    },
    /**
     * 调用原生toast
     * @function toast
     * @memberOf module:UI
     * @param {string} message toast的文本
     * @param {string} [duration=3000] 显示的时长
     * @example
     * HdSmart.UI.toast('我要显示toast信息')
     */
    toast (message, duration = 3000){
        bridge.send(apiList.ui_toast, {message, duration})
    },
    /**
     * 切换显示头部和底部
     * @function toggleHeadAndFoot
     * @memberOf module:UI
     * @param {boolean} isDisplayed 是否显示头部和底部
     * @example
     * HdSmart.UI.toggleHeadAndFoot(true);
     * HdSmart.UI.toggleHeadAndFoot(false);
     */
    toggleHeadAndFoot (visible){
        bridge.send(apiList.ui_toggleheadandfoot, {show_head_foot: visible})
    },
}

//Util
api.Util = {
    dispatchEvent (params, callback){
        bridge.send(apiList.util_dispatchevent, params, (data)=>{

            var error = null
            if(typeof data === 'string'){
                //HACK: app返回json数据有问题，没找到解决方案
                try{
                    data = JSON.parse(data)
                }catch(e){
                    try{
                        data = data.replace(/\n/g,'\\n');
                        data = data.replace(/:"([^{[]*?)("[,}])/g,function(match,v,q){
                            return ':"' + v.replace(/"/g,'\\"') + q;
                        });
                        data = JSON.parse(data)
                    }catch(e){
                        error = {
                            errormsg: tipMsg.jsonerr
                        }
                    }
                }
            }else if(typeof data === 'undefined'){
                data = {}
            }

            if(data.code === 504){
                error = {
                    errormsg: tipMsg.e504
                }
            }

            callback && callback(error, data)

        }, false)
    },
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
    getNetworkType (onSuccess){
        bridge.send(apiList.util_getnetworktype, '', (data)=>{
            onSuccess(data)
        }, false)
    },
    post (){
        console.log('暂不实现')
    },
    /**
     * 刷新当前webView
     * @function reload
     * @memberOf module:Util
     * @author ive.chen
     * @example
     * HdSmart.Util.reload();
     */
    reload (){
        bridge.send(apiList.util_reload)
    },
    /**
     * 发送推送信息
     * @function sendNotification
     * @memberOf module:Util
     * @author ive.chen
     * @param {string} title  notification标题
     * @param {string} message  notification消息体
     * @example
     * HdSmart.Util.sendNotification('消息标题','消息体');
     */
    sendNotification (title, message){
        bridge.send(apiList.util_sendnotification, {title, message})
    },
}

export default api

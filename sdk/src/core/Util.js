import bridge from '../bridge/app'
import {apiList, tipMsg} from '../constant'

export default {
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

            if(data.code === 505){
                error = {
                    errormsg: tipMsg.e505
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

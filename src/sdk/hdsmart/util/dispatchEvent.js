import {isFunction, log} from '../helper';
/**
 * 通过app操作请求server和其他方法
 * @function dispatchEvent
 * @memberOf module:Util
 * @author sheruxiu
 * @param {object} options={}  请求的数据
 * @param {object} options.data
 * @param {String} options.data.deviceType  设备类型名称，如tv
 * @param {String} options.data.method  方法名称，如getChannelData
 * @param {object} options.data.params  请求参数
 * @param {function} options.onListener  回调函数
 * @example
 * HdSmart.Util.dispatchEvent({ 
 *      data: {
 *          deviceType: 'tv',
 *          method: 'getChannelData',
 *          params: {
 *          
 *          }
 *      },
 *      onListener: function(data){
 *          console.log(data)
 *      }
 * })
 */

//todo 需要确定返回的code的enum列表

const ERROR_504 = '网络异常，请稍后重试'
const ERROR_JSONSTR = 'JSON解析错误'

export default function (params, callback) {
        HdIot.Util.dispatchEvent({
            data: JSON.stringify(params),
            onListener(data) {
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
                                errormsg: ERROR_JSONSTR
                            }
                        }
                    }
                }else if(typeof data === 'undefined'){ 
                    data = {}
                }

                if(data.code === 504){  
                    error = {   
                        errormsg: ERROR_504
                    }
                }

                callback && callback(error, data)
            }
        })
    
}
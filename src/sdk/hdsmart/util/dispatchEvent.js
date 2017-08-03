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


export default function (options) {

        HdIot.Util.dispatchEvent({
            data: JSON.stringify(options.data),
            onListener(data) {
                if(options.onListener){
                    if(typeof data === 'string'){  
                        /* data = data.replace(/\s/g,'').replace(/"desc":"(.*?)",/g,function(a,b){
                            return '"desc":"'+ b.replace(/"/g,'“') +'",'
                        }) */
                        //HACK: app返回json数据有问题，没找到解决方案
                        if(options.data.method === 'getDetaileData'){
                            data = data.replace(/"desc"\s?:\s?"([\s\S+]*?)",/g, function(a,b){ 
                                var str = b.replace(/\s+/g,'<br/>').replace(/"/g,'“')
                                return `"desc": "${str}",`
                            })
                        }
                        try{
                            data = JSON.parse(data)
                        }catch(e){  
                            data = {code:504}
                            HdSmart.UI.toast('json解析错误')
                        }
                    }
                    options.onListener(data)
                }
            }
        })
    
}
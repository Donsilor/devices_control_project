import {isFunction, log} from '../helper';
/**
 * 通过app代理外部ajax请求
 * @function post
 * @memberOf module:Util
 * @author ive.chen
 * @param {string} url  请求的资源地址
 * @param {object} data={}  请求的数据
 * @param {function} onSuccess  请求成功的返回
 * @param {function} [onFailure]  请求失败的返回
 * @example
 * HdSmart.Util.post("http://www.baidu.com/getCity",{provice:"guangdong"},function(data){
 *      //请求的返回结果 data
 * },function(error){
 *      //错误
 * });
 */
export default function (url, data, onSuccess, onFailure) {
    let dataOptions = JSON.stringify({
        url: url,
        data: data
    });
    HdIot.Util.post({
        data: dataOptions,
        onListener: function (data) {
            if (isFunction(onSuccess)) {
                onSuccess(data)
            }
            log('post', dataOptions, data);
        }
    })
}
/**
 * 通过app代理发送ajax post请求
 * @function post
 * @memberOf module:Util
 * @param {object} options JsBridge通信协议要求实现
 * @param {string} options.data='' JsBridge通信协议要求传递数据,需要JSON格式字符串
 * @param {string} options.data.url 请求数据的地址
 * @param {object} options.data.data 请求数据的参数
 * @param {function} options.onListener JsBridge通信协议要求回调方式，当请求成功或者失败后返回
 * @example
 * HdIot.Util.post({
 *      data: {
 *          url:'http://www.baidu.com/getCity',
 *          data:{
 *              province:'guangdong
 *          }
 *      }，
 *      onListener:function(data){
 *          //data为获取network的返回数据
 *      }
 * })
 */

export default function (options) {
    options.onListener(options.data);
}
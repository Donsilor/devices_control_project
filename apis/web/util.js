/**
 * 通过app提供代理请求
 * @method HdSmart.Util.post
 * @param {String} url 请求的地址
 * @param {Object} data 请求的参数对象
 * @param {Function} onSuccess 成功的回调函数
 * @param {Function} onFailure 失败的回调函数
 * @example
 * HdSmart.Util.post("http://www.baidu.com/getCity",{provice:"guangdong"},function(data){
 *      //请求的返回结果 data
 * },function(error){
 *      //错误
 * })
 */

/**
 *  重新加载当前页面
 *  @method HdSmart.Util.reload
 *  @example
 *  HdSmart.Util.reload()
 */

/**
 * 获取app当前网络环境
 * @method HdSmart.Util.getNetworkType
 * @param {Function} onSuccess 获取网络环境后的回调函数
 * @return {String} type 返回网络状态
 * @example
 * HdSmart.Util.getNetworkType(function(type){
 *      //返回网络类型 type : wifi 4g 3g .etc
 * })
 */

/**
 * 使用原生的notification进行消息推送
 * @method HdSmart.Util.sendNotification
 * @since 2017.04.24
 * @param {String} title 推送标题
 * @param {String} message 推送消息
 * @method HdSmart.Util.sendNotification('消息标题','消息体')
 * });
 */
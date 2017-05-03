/**
 * 通过app提供代理请求
 * @method HdIot.Util.post
 * @param {String} data 用于请求的经过字符串化的参数
 * @param {String} data.url 请求的地址
 * @param {Object} data.data 请求的参数对象
 * @param {Function} onListener 请求返回后的回调函数
 * @example
 * HdIot.Util.post({
 *      data:JSON.stringify({
 *          url:"http://www.baidu.com/getCities",
 *          data:{
 *              province:"guangdong"
 *          }
 *      }),
 *      onListener:function(data){
 *          //data为请求返回的数据
 *      }
 * })
 */

/**
 *  重新加载当前页面
 *  @method HdIot.Util.reload
 *  @param data 空值('')
 *  @example
 *  HdIot.Util.reload({
 *      data:''
 *  })
 */

/**
 * 获取app当前网络环境
 * @method HdIot.Util.getNetworkType
 * @param {String} data 空值('')
 * @param {Function} onListener 获取网络环境后的回调函数
 * @example
 * HdIot.Util.getNetworkType({
 *      data:'',
 *      onListener:function(type){
 *          //type为网络环境，包括wifi 3g 4g .etc
 *      }
 * });
 */


/**
 * 使用原生的notification进行消息推送
 * @method HdIot.Util.sendNotification
 * @since 2017.04.24
 * @param {String} data 经过字符串化的控制协议对象
 * @param {String} data.title 推送标题
 * @param {String} data.message 推送消息
 * @method HdIot.Util.sendNotification({
 *      data:JSON.stringify({
 *          title:'',
 *          message:''
 *      })
 * });
 */
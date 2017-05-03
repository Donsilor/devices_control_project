/**
 * 获取设备快照
 * @method HdSmart.Device.getSnapShot
 * @param {Function} onSuccess 返回快照成功回调函数
 * @param {Function} onFailure 返回快照失败的回调函数
 * @example
 * HdSmart.Device.getSnapShot(function(data,service_time){
 *      //data为获取快照成功后返回的数据
 *      //service_time 服务器时间
 * },function(error){
 *      //返回失败的原因
 * });
 */

/**
 * 控制设备
 * @method HdSmart.Device.control
 * @param {String} method 控制设备的method
 * @param {String} cmd 控制设备的command
 * @param {String} attr 控制设备的相关属性
 * @param {Function} onSuccess 控制成功的回调函数
 * @param {Function} onFailure 控制失败的回调函数
 * @example
 * HdSmart.Device.control('method','cmd',attr,function(data){
 *      //data为控制成功后设备返回的状态
 * },function(error){
 *      //控制失败
 * })
 */

/**
 * 获取设备日志
 * @method HdSmart.Device.getDeviceLog
 * @since 2017.04.24
 * @param {Object} data
 * @param {String} data.items_per_page 每页数据量 默认为8
 * @param {String} data.start_time 数据起始时间戳
 * @param {String} data.direction 获取数据的方式 down或者up (类似asc和desc)
 * @param {Function} onSuccess 获取成功后的返回函数
 * @param {Function} onError 获取失败后的返回函数
 * @example
 * HdSmart.Device.getDeviceLog({
 *          start_time: new Date(2017,4,1),
 *          //items_per_page:8，
 *          direction:'down'
 *      }，
 *      function(data){
 *          //data为获取历史成功由设备端返回的数据
 *      }
 * })
 */

/**
 * 按提供时间提供过去一天内的设备日志
 * @method HdSmart.Device.getDeviceLogByDay
 * @since 2017.05.03
 * @param {String} start_time 准点的时间戳(13位),
 * @param {Function} onListener 控制成功后的返回函数
 * @example
 * HdSmart.Device.getDeviceLogByDay(+ new Date('2017-05-03 05:00:00'),function(data){
 *          //data为控制成功由设备端返回的数据
 * })
 */


/**
 * 获取当月份具有日志的日期
 * @method HdSmart.Device.getDeviceMonthHistory
 * @since 2017.04.24
 * @param {Object} year 日志年
 * @param {Object} month 日志月
 * @example
 * HdSmart.Device.getDeviceMonthHistory(year,month，
 *      function(data){
 *          //data为获取历史成功由设备端返回的数据
 *      }
 * })
 */
/**
 * 获取设备快照
 * @method HdIot.Device.getSnapShot
 * @param {String} data 空值('')
 * @param {Function} onListener app获取快照成功的返回函数
 * @example
 * HdIot.Device.getSnapShot({
 *      data:'',
 *      onListener:function(data){
 *          //data为获取快照成功后，由http返回的设备相关状态数据
 *      }
 * })
 */

/**
 * 控制设备
 * @method HdIot.Device.control
 * @param {String} data 经过字符串化的控制协议对象
 * @param {Function} onListener 控制成功后的返回函数
 * @example
 *
 * HdIot.Device.control({
 *      data: JSON.stringify({
 *              method:'method',
 *              req_id:12345
 *              params:{
 *                  cmd:'cmd',
 *                  device_uuid:'abc123',
 *                  attr:{
 *                      mode:'pause'
 *                  }
 *              }
 *      })，
 *      onListener:function(data){
 *          //data为控制成功由设备端返回的数据
 *      }
 * })
 */


/**
 * 获取设备日志
 * @method HdIot.Device.getDeviceLog
 * @since 2017.04.24
 * @param {String} data 经过字符串化的控制协议对象
 * @param {String} data.device_uuid 设备的uuid,
 * @param {String} data.page_number 当前分页
 * @param {String} data.direction  取值为up或者down
 * @param {String} data.items_per_page 每页数据量
 * @param {Function} onListener 控制成功后的返回函数
 * @example
 * HdIot.Device.getDeviceLog({
 *      data: JSON.stringify({
 *          method:'getDeviceLog',
 *          req_id:'1234567',
 *          params:{
 *              direction:'up',
 *              device_uuid:'1234',
 *              page_number:1,
 *              items_per_page:8
 *          }
 *      })，
 *      onListener:function(data){
 *          //data为控制成功由设备端返回的数据
 *      }
 * })
 */



/**
 * 获取当月份具有日志的日期
 * @method HdIot.Device.getDeviceMonthHistory
 * @since 2017.04.24
 * @param {String} data 经过字符串化的控制协议对象
 * @param {String} data.device_uuid 设备的uuid,
 * @param {String} data.year 日志年
 * @param {String} data.month 日志月
 * @param {Function} onListener 控制成功后的返回函数
 * @example
 * HdIot.Device.getDeviceMonthHistory({
 *      data: JSON.stringify({
 *          method:'getDeviceMonthHistory',
 *          req_id:'1234567',
 *          params:{
 *              device_uuid:'1234',
 *              year:2017,
 *              month:5
 *          }
 *      })，
 *      onListener:function(data){
 *          //data为控制成功由设备端返回的数据
 *      }
 * })
 */
/**
 * 当设备加载ready后，要执行的函数,可多次使用该函数
 *
 * @method HdSmart.ready
 * @param {Function} onReady 当页面加载完成后的执行函数
 * @example
 * HdSmart.ready(function(){
 *      //此处处理的代码已确保页面加载完成
 * })
 */


/**
 * 当设备的状态通过被动方式变更后进行的处理
 * @method HdSmart.onDeviceListen
 * @param {Function} onListen 当有数据返回的时候的执行函数
 * @example
 * HdSmart.Device.listen(function(data){
 *      //data为设备状态变更有返回的数据
 * })
 */
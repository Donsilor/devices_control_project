/**
 * 显示app原生alert
 * @method HdSmart.UI.alert
 * @param {String} title 弹出的标题 (默认为:null)
 * @param {String} message 弹出的消息内容
 * @param {Function} onSuccess 点击确认以后的回调函数
 * @param {String} okText 确定按钮的文字 (默认为:确定)
 * @param {String} cancelText 取消按钮的文字(默认为:取消)
 * @example
 * HdSmart.UI.alert(title,message,function(){
 *      //点击确定的执行函数
 * },'确定','取消')
 */

/**
 * 显示app原生toast
 * @method HdSmart.UI.toast
 * @param {String} message toast显示的消息内容
 * @param {Number} delay toast显示多久后自动消失(默认为:3000ms)
 * @example
 * HdSmart.UI.toast("this is a toast",3000)
 */

/**
 * 显示原生加载效果
 * @method HdSmart.UI.showLoading
 * @example
 * HdSmart.UI.showLoading();
 */

/**
 * 隐藏原生加载效果
 * @method HdSmart.UI.hideLoading
 * @example
 * HdSmart.UI.hideLoading();
 */

/**
 *  设置允许webView进行Touch的区域，否则touch会触发默认的刷新操作，暂时只能调用一次，多次调用会覆盖前面,所有坐标都以webView左上角为原点进行计算
 *  @since 2017.5.2
 *  @method HdSmart.UI.setWebViewTouchRect
 *  @param {Number | String} left 可touch区域左上角坐标x轴 或者为 百分比
 *  @param {Number | String} top 可touch区域左上角坐标y轴 或者为 百分比
 *  @param {Number | String} right 可touch区域右下角坐标x轴 或者为 百分比
 *  @param {Number | String} bottom 可touch区域右下角坐标y轴 或者为 百分比
 *
 *  @example
 *
 *  HdSmart.UI.setWebViewTouchRect(0,0,1000,1000);
 *  HdSmart.UI.setWebViewTouchRect(0,0,'100%','100%');
 */
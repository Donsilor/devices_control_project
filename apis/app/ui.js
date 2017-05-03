/**
 * 显示app原生alert
 * @method HdIot.UI.alert
 * @param {String} data 传递给app的alert的经过字符串化的相关配置项
 * @param {String} data.title 弹出的标题 (默认为:null)
 * @param {String} data.message 弹出的消息内容
 * @param {String} data.okText 确定按钮的文字 (默认为:确定)
 * @param {String} data.cancelText 取消按钮的文字(默认为:取消)
 * @param {Function} onListener 点击确认以后的回调函数
 *
 * @example
 * HdIot.UI.alert({
 *    data: JSON.stringify({
 *          title:'',
 *          message:'this is an alert',
 *          okText:'sure',
 *          cancelText:'not sure'
 *    }),
 *    onListener:function(){
 *      //执行点击了确定(okText)的相关回调动作
 *    }
 * })
 */

/**
 * 显示app原生toast
 * @method HdIot.UI.toast
 * @param {String} data 传递给app的toast的经过字符串化的相关配置项
 * @param {String} data.message toast显示的消息内容
 * @param {Number} data.delay toast显示多久后自动消失(默认为:3000ms)
 * @example
 * HdIot.UI.toast({
 *      data:JSON.stringify({
 *          message:'i'm a toast',
 *          delay:2000
 *      })
 * })
 */

/**
 * 显示原生加载效果
 * @method HdIot.UI.showLoading
 * @param {String} data 空值('')
 * @example
 * HdIot.UI.showLoading({
 *      data:''
 * })
 */

/**
 * 隐藏原生加载效果
 * @method HdIot.UI.hideLoading
 * @param {String} data 空值('')
 * @example
 * HdIot.UI.hideLoading({
 *      data:''
 * })
 */

/**
 * 设置WebView可touch区域
 * @method HdIot.UI.setTouchRect
 * @param {String} data 传递给app的toast的经过字符串化的相关配置项
 * @param {Number} data.left 左上角坐标的x轴
 * @param {Number} data.top 左上角坐标的y轴
 * @param {Number} data.right 右下角坐标的x轴
 * @param {Number} data.bottom 右下角坐标的y轴
 * @example
 * HdIot.UI.setTouchRect({
 *      data:JSON.stringify({
 *          left:0,
 *          top:0,
 *          right:1000,
 *          bottom:1000
 *      })
 * })
 */

/**
 *  是否显示头部和底部
 *  @since 2017.5.3
 *  @method HdIot.UI.toggleHeadAndFoot
 * @param {String} data 传递给app的toast的经过字符串化的相关配置项
 *  @param {Boolean} data.isHeadAndFootShown 是否显示头部
 *
 *  @example
 * HdIot.UI.toggleHeadAndFoot({
 *      data:JSON.stringify({
 *          show_head_foot:true
 *      })
 * })
 */
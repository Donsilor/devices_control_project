webpackJsonp([0],[,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(29),i=n(18),a=n.n(i),r=n(3),s=n.n(r),c=n(4),l=n.n(c),u=n(22),d=n.n(u),f=n(21),p=n.n(f),_=n(19),v=n.n(_),m=n(20),g=n.n(m);o.a.component("navigator",d.a),o.a.component("curtain",p.a),o.a.component("clothes",v.a),o.a.component("control",g.a),o.a.use(l.a,{AlloyFinger:s.a}),HdSmart.ready(function(){new o.a({el:"#app",render:function(e){return e(a.a)}})})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(10),i=n.n(o);!function(e,t){function n(e){return"function"==typeof e}function o(){return e.device_uuid}function a(){var e="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=10*Math.random()|0;return("x"==e?t:3&t|8).toString(16)});return e=e.replace(/^0/,"1")}if(e.HdSmart)return!1;var r={};r.Device={},r.Device.control=function(e,t,n,r,s){HdIot.Device.control({data:i()({method:e,req_id:a(),params:{device_uuid:o(),cmd:t,attr:n}}),onListener:function(e){r(e)}})},r.Device.getDeviceLog=function(e,t){HdIot.Device.getDeviceLog({data:i()({method:"getDeviceLog",req_id:a(),params:{device_uuid:o(),start_time:e.start_time,items_per_page:"number"==typeof e.items_per_page?e.items_per_page:8,direction:e.direction}}),onListener:function(e){e=JSON.parse(e),n(t)&&t(e.result)}})},r.Device.getDeviceMonthHistory=function(e,t){HdIot.Device.getDeviceMonthHistory({data:i()({method:"getDeviceMonthHistory",req_id:a(),params:{device_uuid:o(),start_time:parseInt(e/1e3)}}),onListener:function(e){console.log(e),e=JSON.parse(e),n(t)&&t(e)}})},r.Device.getSnapShot=function(e,t){HdIot.Device.getSnapShot({data:"",onListener:function(n){n=JSON.parse(n),n.result?e(n.result,n.timestamp||n.result.timestamp):t(n)}})},r.UI={},r.UI.alert=function(e,t,n,o,a){o=o||"确定",a=a||"取消",HdIot.UI.alert({data:i()({title:e,message:t,okText:o,cancelText:a}),onListener:function(){n()}})},r.UI.toast=function(e,t){t=t||3e3,HdIot.UI.toast(e,t)},r.UI.showLoading=function(){HdIot.UI.showLoading({data:""})},r.UI.hideLoading=function(){HdIot.UI.hideLoading({data:""})},r.Util={},r.Util.getNetworkType=function(e){HdIot.Util.getNetworkType(e)},r.Util.reload=function(){HdIot.Util.reload()},r.Util.post=function(e,t,n,o){HdIot.Util.post({data:i()({url:e,data:t}),onListener:function(e){n(e)}})},r.Util.sendNotification=function(e,t){HdIot.Util.sendNotification({data:i()({title:e,message:t})})};var s=!1,c=[],l=[];e.HdSmart={ready:function(e){s?e():c.push(e)},onDeviceListen:function(e){l.push(e)}},e.onDeviceChange=function(e){for(var t=l.length,o=0;o<t;o++)n(l[o])&&l[o](e)},e.onDeviceJsReady=function(){if(!e.HdIot)throw new Error("当前环境没有可用的api");for(s||(r.ready=e.HdSmart.ready,r.onDeviceListen=e.HdSmart.onDeviceListen,e.HdSmart=r,s=!0);c.length;){var t=c.pop();n(t)&&t()}}}(window)},,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={name:"app",data:function(){var e=localStorage.getItem("close_percent");return isNaN(e)&&(e=null,localStorage.removeItem("close_percent")),{close_percent:0,rafId:0}},mounted:function(){var e=this;HdSmart.Device.getSnapShot(function(t){var n=parseInt(localStorage.getItem("close_percent"));isNaN(n)&&(n=null,localStorage.removeItem("close_percent")),e.close_percent=0,localStorage.setItem("close_percent",e.close_percent)})},methods:{onOpen:function(e){var t=this,n=function e(){var n=t.close_percent-3.9;n<=0&&(n=0),0===n?cancelAnimationFrame(t.rafId):t.rafId=window.requestAnimationFrame(e),t.close_percent=n,localStorage.setItem("close_percent",t.close_percent)};HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"on"},function(o){cancelAnimationFrame(t.rafId),e(),t.rafId=window.requestAnimationFrame(n)})},onClose:function(e){var t=this,n=function e(){var n=t.close_percent+3.9;n>=100&&(n=100),100===n?cancelAnimationFrame(t.rafId):t.rafId=window.requestAnimationFrame(e),t.close_percent=n,localStorage.setItem("close_percent",t.close_percent)};HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"off"},function(o){cancelAnimationFrame(t.rafId),e(),t.rafId=window.requestAnimationFrame(n)})},onPause:function(e){var t=this;HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"pause"},function(n){cancelAnimationFrame(t.rafId),e(),localStorage.setItem("close_percent",t.close_percent)})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{percent:.2+.8*this.close_percent/100,opacity:1-.9*this.close_percent/100}},watch:{close_percent:function(){this.percent=.2+.8*this.close_percent/100,this.opacity=1-.9*this.close_percent/100}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{is_on_loading:!1,is_off_loading:!1,is_pause_loading:!1}},methods:{onOpenTouchStart:function(){var e=this;this.is_on_loading=!0,this.is_off_loading=!1,this.is_pause_loading=!1,this.$emit("onOpen",function(){e.is_on_loading=!1})},onCloseTouchStart:function(){var e=this;this.is_on_loading=!1,this.is_off_loading=!0,this.is_pause_loading=!1,this.$emit("onClose",function(){e.is_off_loading=!1})},onPauseTouchStart:function(){var e=this;this.is_on_loading=!1,this.is_off_loading=!1,this.is_pause_loading=!0,this.$emit("onPause",function(){e.is_pause_loading=!1})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{translateX:30-30*this.close_percent/100,opacity:1-.7*this.close_percent/100}},watch:{close_percent:function(){this.translateX=30-30*this.close_percent/100,this.opacity=1-.7*this.close_percent/100}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},,,,function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t,n){n(14);var o=n(0)(n(5),n(24),null,null);e.exports=o.exports},function(e,t,n){n(15);var o=n(0)(n(6),n(25),"data-v-4c1958df",null);e.exports=o.exports},function(e,t,n){n(16);var o=n(0)(n(7),n(26),"data-v-93454118",null);e.exports=o.exports},function(e,t,n){n(13);var o=n(0)(n(8),n(23),"data-v-33bcee29",null);e.exports=o.exports},function(e,t,n){n(17);var o=n(0)(n(9),n(27),"data-v-ce22d8a4",null);e.exports=o.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("div",{staticClass:"bg",style:{transform:"translate3d(-50%,-"+e.translateX+"px,0)",opacity:e.opacity}}),e._v(" "),n("clothes",{staticClass:"left",attrs:{close_percent:e.close_percent}}),e._v(" "),n("clothes",{staticClass:"right",attrs:{close_percent:e.close_percent}})],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[null!==e.close_percent?n("navigator",{staticClass:"navigator"}):e._e(),e._v(" "),null!==e.close_percent?n("curtain",{staticClass:"curtain",attrs:{close_percent:e.close_percent}}):e._e(),e._v(" "),null!==e.close_percent?n("control",{staticClass:"control",attrs:{close_percent:e.close_percent},on:{onOpen:e.onOpen,onPause:e.onPause,onClose:e.onClose}}):e._e()],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"box",style:{transform:"scale3d("+e.percent+",1,1)"}},[n("div",{staticClass:"clothes"}),e._v(" "),n("div",{staticClass:"folding",style:{opacity:e.opacity}})])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"box"},[n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onOpenTouchStart,expression:"onOpenTouchStart",arg:"touch-start"}],staticClass:"on button",class:{loading:e.is_on_loading,normal:!e.is_on_loading}}),e._v(" "),n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onPauseTouchStart,expression:"onPauseTouchStart",arg:"touch-start"}],staticClass:"pause button",class:{loading:e.is_pause_loading,normal:!e.is_pause_loading}}),e._v(" "),n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onCloseTouchStart,expression:"onCloseTouchStart",arg:"touch-start"}],staticClass:"off button",class:{loading:e.is_off_loading,normal:!e.is_off_loading}})])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("div",{staticClass:"left circle"}),e._v(" "),n("div",{staticClass:"line"}),e._v(" "),n("div",{staticClass:"right circle"})])}]}},,,,function(e,t,n){n(2),e.exports=n(1)}],[31]);
//# sourceMappingURL=app.e7ee56c9de2d22b3cd5e.js.map
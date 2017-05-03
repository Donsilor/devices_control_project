webpackJsonp([0],[,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(10),i=n.n(o);!function(e,t){function n(e){return"function"==typeof e}function o(){return e.device_uuid}function a(){var e="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=10*Math.random()|0;return("x"==e?t:3&t|8).toString(16)});return e=e.replace(/^0/,"1")}function r(e,t){if("number"==typeof e)return e;if("string"==typeof e){var n=parseInt(e);if(e.indexOf("%")>-1)return t*n/100;if(!isNaN(n))return n}return 0}if(e.HdSmart)return!1;e.apiLog||(e.apiLog=function(e,t,n){});var s={};s.Device={},s.Device.control=function(t,n,r,s,c){var l=i()({method:t,req_id:a(),params:{device_uuid:o(),cmd:n,attr:r}});HdIot.Device.control({data:l,onListener:function(t){e.apiLog("control",l,t),s(t)}})},s.Device.getDeviceLog=function(t,r){var s=i()({method:"getDeviceLog",req_id:a(),params:{device_uuid:o(),start_time:t.start_time,items_per_page:"number"==typeof t.items_per_page?t.items_per_page:8,direction:t.direction}});HdIot.Device.getDeviceLog({data:s,onListener:function(t){e.apiLog("getDeviceLog",s,t),t=JSON.parse(t),n(r)&&r(t.result)}})},s.Device.getDeviceMonthHistory=function(t,r,s){var c=i()({method:"getDeviceMonthHistory",req_id:a(),params:{device_uuid:o(),year:t,month:r}});HdIot.Device.getDeviceMonthHistory({data:c,onListener:function(t){e.apiLog("getDeviceMonthHistory",c,t),t=JSON.parse(t),n(s)&&s(t)}})},s.Device.getSnapShot=function(t,n){HdIot.Device.getSnapShot({data:"",onListener:function(o){e.apiLog("getSnapShot","null",o),o=JSON.parse(o),o.result?t(o.result,o.timestamp||o.result.timestamp):n(o)}})},s.UI={},s.UI.alert=function(e,t,n,o,a){o=o||"确定",a=a||"取消",HdIot.UI.alert({data:i()({title:e,message:t,okText:o,cancelText:a}),onListener:function(){n()}})},s.UI.toast=function(e,t){t=t||3e3,HdIot.UI.toast(e,t)},s.UI.showLoading=function(){HdIot.UI.showLoading({data:""})},s.UI.hideLoading=function(){HdIot.UI.hideLoading({data:""})},s.UI.setWebViewTouchRect=function(e,t,n,o){var a=document.body.getBoundingClientRect();e=r(e,a.width),t=r(t,a.height),n=r(n,a.width),o=r(o,a.height),HdIot.UI.setTouchRect({data:i()({left:e,right:n,top:t,bottom:o})})},s.Util={},s.Util.getNetworkType=function(t){HdIot.Util.getNetworkType({data:"",onListener:function(n){e.apiLog("getNetworkType","null",n),t(n)}})},s.Util.reload=function(){HdIot.Util.reload()},s.Util.post=function(e,t,n,o){HdIot.Util.post({data:i()({url:e,data:t}),onListener:function(e){n(e)}})},s.Util.sendNotification=function(e,t){HdIot.Util.sendNotification({data:i()({title:e,message:t})})};var c=!1,l=[],u=[];e.HdSmart={ready:function(e){c?e():l.push(e)},onDeviceListen:function(e){u.push(e)}},e.onDeviceChange=function(t){e.apiLog("onDeviceListen","null",t);for(var o=u.length,i=0;i<o;i++)n(u[i])&&u[i](t)},e.onDeviceJsReady=function(){if(!e.HdIot)throw new Error("当前环境没有可用的api");for(c||(s.ready=e.HdSmart.ready,s.onDeviceListen=e.HdSmart.onDeviceListen,e.HdSmart=s,c=!0);l.length;){var t=l.pop();n(t)&&t()}}}(window)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(29),i=n(18),a=n.n(i),r=n(3),s=n.n(r),c=n(4),l=n.n(c),u=n(22),d=n.n(u),f=n(21),p=n.n(f),_=n(19),v=n.n(_),g=n(20),m=n.n(g);o.a.component("navigator",d.a),o.a.component("curtain",p.a),o.a.component("clothes",v.a),o.a.component("control",m.a),o.a.use(l.a,{AlloyFinger:s.a}),HdSmart.ready(function(){new o.a({el:"#app",render:function(e){return e(a.a)}})})},,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={name:"app",data:function(){var e=localStorage.getItem("close_percent");return isNaN(e)&&(e=null,localStorage.removeItem("close_percent")),{close_percent:0,rafId:0}},mounted:function(){var e=this;HdSmart.Device.getSnapShot(function(t){var n=parseInt(localStorage.getItem("close_percent"));isNaN(n)&&(n=null,localStorage.removeItem("close_percent")),e.close_percent=0,localStorage.setItem("close_percent",e.close_percent)})},methods:{onOpen:function(e){var t=this,n=function e(){var n=t.close_percent-3.9;n<=0&&(n=0),0===n?cancelAnimationFrame(t.rafId):t.rafId=window.requestAnimationFrame(e),t.close_percent=n,localStorage.setItem("close_percent",t.close_percent)};HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"on"},function(o){cancelAnimationFrame(t.rafId),e(),t.rafId=window.requestAnimationFrame(n)})},onClose:function(e){var t=this,n=function e(){var n=t.close_percent+3.9;n>=100&&(n=100),100===n?cancelAnimationFrame(t.rafId):t.rafId=window.requestAnimationFrame(e),t.close_percent=n,localStorage.setItem("close_percent",t.close_percent)};HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"off"},function(o){cancelAnimationFrame(t.rafId),e(),t.rafId=window.requestAnimationFrame(n)})},onPause:function(e){var t=this;HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"pause"},function(n){cancelAnimationFrame(t.rafId),e(),localStorage.setItem("close_percent",t.close_percent)})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{percent:.2+.8*this.close_percent/100,opacity:1-.9*this.close_percent/100}},watch:{close_percent:function(){this.percent=.2+.8*this.close_percent/100,this.opacity=1-.9*this.close_percent/100}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{is_on_loading:!1,is_off_loading:!1,is_pause_loading:!1}},methods:{onOpenTouchStart:function(){var e=this;this.is_on_loading=!0,this.is_off_loading=!1,this.is_pause_loading=!1,this.$emit("onOpen",function(){e.is_on_loading=!1})},onCloseTouchStart:function(){var e=this;this.is_on_loading=!1,this.is_off_loading=!0,this.is_pause_loading=!1,this.$emit("onClose",function(){e.is_off_loading=!1})},onPauseTouchStart:function(){var e=this;this.is_on_loading=!1,this.is_off_loading=!1,this.is_pause_loading=!0,this.$emit("onPause",function(){e.is_pause_loading=!1})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{translateX:30-30*this.close_percent/100,opacity:1-.7*this.close_percent/100}},watch:{close_percent:function(){this.translateX=30-30*this.close_percent/100,this.opacity=1-.7*this.close_percent/100}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},,,,function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t,n){n(14);var o=n(0)(n(5),n(24),null,null);e.exports=o.exports},function(e,t,n){n(13);var o=n(0)(n(6),n(23),"data-v-0bcf0721",null);e.exports=o.exports},function(e,t,n){n(17);var o=n(0)(n(7),n(27),"data-v-76130db6",null);e.exports=o.exports},function(e,t,n){n(15);var o=n(0)(n(8),n(25),"data-v-191ac72a",null);e.exports=o.exports},function(e,t,n){n(16);var o=n(0)(n(9),n(26),"data-v-41f1b970",null);e.exports=o.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"box",style:{transform:"scale3d("+e.percent+",1,1)"}},[n("div",{staticClass:"clothes"}),e._v(" "),n("div",{staticClass:"folding",style:{opacity:e.opacity}})])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[null!==e.close_percent?n("navigator",{staticClass:"navigator"}):e._e(),e._v(" "),null!==e.close_percent?n("curtain",{staticClass:"curtain",attrs:{close_percent:e.close_percent}}):e._e(),e._v(" "),null!==e.close_percent?n("control",{staticClass:"control",attrs:{close_percent:e.close_percent},on:{onOpen:e.onOpen,onPause:e.onPause,onClose:e.onClose}}):e._e()],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("div",{staticClass:"bg",style:{transform:"translate3d(-50%,-"+e.translateX+"px,0)",opacity:e.opacity}}),e._v(" "),n("clothes",{staticClass:"left",attrs:{close_percent:e.close_percent}}),e._v(" "),n("clothes",{staticClass:"right",attrs:{close_percent:e.close_percent}})],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("div",{staticClass:"left circle"}),e._v(" "),n("div",{staticClass:"line"}),e._v(" "),n("div",{staticClass:"right circle"})])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"box"},[n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onOpenTouchStart,expression:"onOpenTouchStart",arg:"touch-start"}],staticClass:"on button",class:{loading:e.is_on_loading,normal:!e.is_on_loading}}),e._v(" "),n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onPauseTouchStart,expression:"onPauseTouchStart",arg:"touch-start"}],staticClass:"pause button",class:{loading:e.is_pause_loading,normal:!e.is_pause_loading}}),e._v(" "),n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onCloseTouchStart,expression:"onCloseTouchStart",arg:"touch-start"}],staticClass:"off button",class:{loading:e.is_off_loading,normal:!e.is_off_loading}})])},staticRenderFns:[]}},,,,function(e,t,n){n(1),e.exports=n(2)}],[31]);
//# sourceMappingURL=app.0ad90858845b4546b225.js.map
webpackJsonp([0],[,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),i=n.n(o);!function(e,t){function n(e){return"function"==typeof e}function o(){return e.device_uuid}function a(){var e="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=10*Math.random()|0;return("x"==e?t:3&t|8).toString(16)});return e=e.replace(/^0/,"1")}function r(e,t){if("number"==typeof e)return e;if("string"==typeof e){var n=parseInt(e);if(e.indexOf("%")>-1)return t*n/100;if(!isNaN(n))return n}return 0}if(e.HdSmart)return!1;e.apiLog||(e.apiLog=function(e,t,n){});var c={};c.Device={},c.Device.control=function(t,n,r,c,s){var l=i()({method:t,req_id:a(),params:{device_uuid:o(),cmd:n,attr:r}});HdIot.Device.control({data:l,onListener:function(t){e.apiLog("control",l,t),c(t)}})},c.Device.getDeviceLog=function(t,r){var c=i()({method:"getDeviceLog",req_id:a(),params:{device_uuid:o(),start_time:t.start_time,items_per_page:"number"==typeof t.items_per_page?t.items_per_page:8,direction:t.direction}});HdIot.Device.getDeviceLog({data:c,onListener:function(t){e.apiLog("getDeviceLog",c,t),t=JSON.parse(t),n(r)&&r(t.result)}})},c.Device.getDeviceLogByDay=function(t,r){var c=i()({method:"getDeviceLogByDay",req_id:a(),params:{start_time:t,device_uuid:o()}});HdIot.Device.getDeviceLogByDay({data:c,onListener:function(t){t=JSON.parse(t),e.apiLog("getDeviceLogByDay",c,t),n(r)&&r(t)}})},c.Device.getDeviceMonthHistory=function(t,r,c){var s=i()({method:"getDeviceMonthHistory",req_id:a(),params:{device_uuid:o(),year:t,month:r}});HdIot.Device.getDeviceMonthHistory({data:s,onListener:function(t){e.apiLog("getDeviceMonthHistory",s,t),t=JSON.parse(t),n(c)&&c(t)}})},c.Device.getSnapShot=function(t,n){HdIot.Device.getSnapShot({data:"",onListener:function(o){e.apiLog("getSnapShot","",o),o=JSON.parse(o),o.result?t(o.result,o.timestamp||o.result.timestamp):n(o)}})},c.UI={},c.UI.alert=function(e,t,n,o,a){o=o||"确定",a=a||"取消",HdIot.UI.alert({data:i()({title:e,message:t,okText:o,cancelText:a}),onListener:function(){n()}})},c.UI.toast=function(e,t){t=t||3e3,HdIot.UI.toast(e,t)},c.UI.showLoading=function(){HdIot.UI.showLoading({data:""})},c.UI.hideLoading=function(){HdIot.UI.hideLoading({data:""})},c.UI.setWebViewTouchRect=function(t,n,o,a){var c=document.body.getBoundingClientRect();t=r(t,c.width),n=r(n,c.height),o=r(o,c.width),a=r(a,c.height);var s=i()({left:t,right:o,top:n,bottom:a});HdIot.UI.setTouchRect({data:s}),e.apiLog("setWebViewTouchRect",s,"")},c.Util={},c.Util.getNetworkType=function(t){HdIot.Util.getNetworkType({data:"",onListener:function(n){e.apiLog("getNetworkType","",n),t(n)}})},c.Util.reload=function(){HdIot.Util.reload()},c.Util.post=function(e,t,n,o){HdIot.Util.post({data:i()({url:e,data:t}),onListener:function(e){n(e)}})},c.Util.sendNotification=function(e,t){HdIot.Util.sendNotification({data:i()({title:e,message:t})})},c.UI.toggleHeadAndFoot=function(e){HdIot.UI.toggleHeadAndFoot({data:i()({show_head_foot:e})})};var s=!1,l=[],u=[];e.HdSmart={ready:function(e){s?e():l.push(e)},onDeviceListen:function(e){u.push(e)}},e.onDeviceChange=function(t){e.apiLog("onDeviceListen","",t);for(var o=u.length,i=0;i<o;i++)n(u[i])&&u[i](t)},e.onDeviceJsReady=function(){if(!e.HdIot)throw new Error("当前环境没有可用的api");for(s||(c.ready=e.HdSmart.ready,c.onDeviceListen=e.HdSmart.onDeviceListen,e.HdSmart=c,s=!0);l.length;){var t=l.pop();n(t)&&t()}}}(window)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(31),i=n(20),a=n.n(i),r=n(5),c=n.n(r),s=n(6),l=n.n(s),u=n(24),d=n.n(u),f=n(23),p=n.n(f),_=n(21),v=n.n(_),g=n(22),m=n.n(g);o.a.component("navigator",d.a),o.a.component("curtain",p.a),o.a.component("clothes",v.a),o.a.component("control",m.a),o.a.use(l.a,{AlloyFinger:c.a}),HdSmart.ready(function(){new o.a({el:"#app",render:function(e){return e(a.a)}})})},,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={name:"app",data:function(){var e=localStorage.getItem("close_percent");return isNaN(e)&&(e=null,localStorage.removeItem("close_percent")),{close_percent:0,rafId:0}},mounted:function(){var e=this;HdSmart.Device.getSnapShot(function(t){var n=parseInt(localStorage.getItem("close_percent"));isNaN(n)&&(n=null,localStorage.removeItem("close_percent")),e.close_percent=0,localStorage.setItem("close_percent",e.close_percent)})},methods:{onOpen:function(e){var t=this,n=function e(){var n=t.close_percent-3.9;n<=0&&(n=0),0===n?cancelAnimationFrame(t.rafId):t.rafId=window.requestAnimationFrame(e),t.close_percent=n,localStorage.setItem("close_percent",t.close_percent)};HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"on"},function(o){cancelAnimationFrame(t.rafId),e(),t.rafId=window.requestAnimationFrame(n)})},onClose:function(e){var t=this,n=function e(){var n=t.close_percent+3.9;n>=100&&(n=100),100===n?cancelAnimationFrame(t.rafId):t.rafId=window.requestAnimationFrame(e),t.close_percent=n,localStorage.setItem("close_percent",t.close_percent)};HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"off"},function(o){cancelAnimationFrame(t.rafId),e(),t.rafId=window.requestAnimationFrame(n)})},onPause:function(e){var t=this;HdSmart.Device.control("setZigbeeCurtain","setOnoff",{mode:"pause"},function(n){cancelAnimationFrame(t.rafId),e(),localStorage.setItem("close_percent",t.close_percent)})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{percent:.2+.8*this.close_percent/100,opacity:1-.9*this.close_percent/100}},watch:{close_percent:function(){this.percent=.2+.8*this.close_percent/100,this.opacity=1-.9*this.close_percent/100}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{is_on_loading:!1,is_off_loading:!1,is_pause_loading:!1}},methods:{onOpenTouchStart:function(){var e=this;this.is_on_loading=!0,this.is_off_loading=!1,this.is_pause_loading=!1,this.$emit("onOpen",function(){e.is_on_loading=!1})},onCloseTouchStart:function(){var e=this;this.is_on_loading=!1,this.is_off_loading=!0,this.is_pause_loading=!1,this.$emit("onClose",function(){e.is_off_loading=!1})},onPauseTouchStart:function(){var e=this;this.is_on_loading=!1,this.is_off_loading=!1,this.is_pause_loading=!0,this.$emit("onPause",function(){e.is_pause_loading=!1})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{close_percent:Number},data:function(){return{translateX:30-30*this.close_percent/100,opacity:1-.7*this.close_percent/100}},watch:{close_percent:function(){this.translateX=30-30*this.close_percent/100,this.opacity=1-.7*this.close_percent/100}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},,,,function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t,n){n(16);var o=n(0)(n(7),n(26),null,null);e.exports=o.exports},function(e,t,n){n(15);var o=n(0)(n(8),n(25),"data-v-0bcf0721",null);e.exports=o.exports},function(e,t,n){n(19);var o=n(0)(n(9),n(29),"data-v-76130db6",null);e.exports=o.exports},function(e,t,n){n(17);var o=n(0)(n(10),n(27),"data-v-191ac72a",null);e.exports=o.exports},function(e,t,n){n(18);var o=n(0)(n(11),n(28),"data-v-41f1b970",null);e.exports=o.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"box",style:{transform:"scale3d("+e.percent+",1,1)"}},[n("div",{staticClass:"clothes"}),e._v(" "),n("div",{staticClass:"folding",style:{opacity:e.opacity}})])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[null!==e.close_percent?n("navigator",{staticClass:"navigator"}):e._e(),e._v(" "),null!==e.close_percent?n("curtain",{staticClass:"curtain",attrs:{close_percent:e.close_percent}}):e._e(),e._v(" "),null!==e.close_percent?n("control",{staticClass:"control",attrs:{close_percent:e.close_percent},on:{onOpen:e.onOpen,onPause:e.onPause,onClose:e.onClose}}):e._e()],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("div",{staticClass:"bg",style:{transform:"translate3d(-50%,-"+e.translateX+"px,0)",opacity:e.opacity}}),e._v(" "),n("clothes",{staticClass:"left",attrs:{close_percent:e.close_percent}}),e._v(" "),n("clothes",{staticClass:"right",attrs:{close_percent:e.close_percent}})],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("div",{staticClass:"left circle"}),e._v(" "),n("div",{staticClass:"line"}),e._v(" "),n("div",{staticClass:"right circle"})])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"box"},[n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onOpenTouchStart,expression:"onOpenTouchStart",arg:"touch-start"}],staticClass:"on button",class:{loading:e.is_on_loading,normal:!e.is_on_loading}}),e._v(" "),n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onPauseTouchStart,expression:"onPauseTouchStart",arg:"touch-start"}],staticClass:"pause button",class:{loading:e.is_pause_loading,normal:!e.is_pause_loading}}),e._v(" "),n("div",{directives:[{name:"finger",rawName:"v-finger:touch-start",value:e.onCloseTouchStart,expression:"onCloseTouchStart",arg:"touch-start"}],staticClass:"off button",class:{loading:e.is_off_loading,normal:!e.is_off_loading}})])},staticRenderFns:[]}},,,,function(e,t,n){n(3),e.exports=n(4)}],[33]);
//# sourceMappingURL=app.0163fc8b60d4a4fc6672.js.map
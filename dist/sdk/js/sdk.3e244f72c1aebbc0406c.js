webpackJsonp([1],[function(t,e,n){t.exports={default:n(3),__esModule:!0}},,function(t,e,n){"use strict";function i(t){return"function"==typeof t}function o(){var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=10*Math.random()|0;return("x"==t?e:3&e|8).toString(16)});return t=t.replace(/^0/,"1")}function r(){return window.device_uuid}function a(t,e,n){window.apiLog(t,e,n)}function c(t,e){if("number"==typeof t)return t;if("string"==typeof t){var n=parseInt(t);if(t.indexOf("%")>-1)return e*n/100;if(!isNaN(n))return n}return 0}e.a=i,e.d=o,e.e=r,e.b=a,e.c=c},function(t,e,n){var i=n(4),o=i.JSON||(i.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(32),o=n(31),r=n(36),a=n(42);window.HdSmart={ready:i.a,onDeviceListen:i.b},window.apiLog=function(t,e,n){};var c=!1;window.onDeviceJsReady=function(){if(!window.HdIot)throw new Error("当前环境没有可用的api");c||(window.HdSmart.ready=i.c,window.HdSmart.Device=o,window.HdSmart.UI=r,window.HdSmart.Util=a,c=!0),i.d()},window.onDeviceChange=function(t){i.e(t)}},,,,,,,,,,,,,,,,,,,,function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e,i,a,c){var u=o()({method:t,req_id:n.i(r.d)(),params:{device_uuid:n.i(r.e)(),cmd:e,attr:i}});HdIot.Device.control({data:u,onListener:function(t){t=JSON.parse(t),n.i(r.b)("control",u,t),504==t.code?c(t):t.result&&n.i(r.a)(a)&&a(t.result)}})}},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e,i){var a=o()({method:"getDeviceLog",req_id:n.i(r.d)(),params:{device_uuid:n.i(r.e)(),start_time:t.start_time,items_per_page:"number"==typeof t.items_per_page?t.items_per_page:8,direction:t.direction}});HdIot.Device.getDeviceLog({data:a,onListener:function(t){n.i(r.b)("getDeviceLog",a,t),t=JSON.parse(t),504==t.code?n.i(r.a)(i)&&i(t):t.result&&n.i(r.a)(e)&&e(t.result)}})}},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e,i){var a=o()({method:"getDeviceLogByDay",req_id:n.i(r.d)(),params:{start_time:t,device_uuid:n.i(r.e)()}});HdIot.Device.getDeviceLogByDay({data:a,onListener:function(t){t=JSON.parse(t),n.i(r.b)("getDeviceLogByDay",a,t),504==t.code?n.i(r.a)(i):n.i(r.a)(e)&&e(t)}})}},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e,i,a){var c=o()({method:"getDeviceMonthHistory",req_id:n.i(r.d)(),params:{device_uuid:n.i(r.e)(),year:t,month:e}});HdIot.Device.getDeviceMonthHistory({data:c,onListener:function(t){n.i(r.b)("getDeviceMonthHistory",c,t),t=JSON.parse(t),504==t.code?n.i(r.a)(a)&&a():n.i(r.a)(i)&&i(t)}})}},function(t,e,n){"use strict";var i=n(2);e.a=function(t,e){HdIot.Device.getSnapShot({data:"",onListener:function(o){n.i(i.b)("getSnapShot","",o),o=JSON.parse(o),o.result?n.i(i.a)(t)&&t(o.result,o.timestamp||o.result.timestamp):n.i(i.a)(e)&&e(o)}})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(26),o=n(30),r=n(27),a=n(28),c=n(29);n.d(e,"control",function(){return i.a}),n.d(e,"getSnapShot",function(){return o.a}),n.d(e,"getDeviceLog",function(){return r.a}),n.d(e,"getDeviceLogByDay",function(){return a.a}),n.d(e,"getDeviceMonthHistory",function(){return c.a})},function(t,e,n){"use strict";var i=n(34),o=n(33);n.d(e,"c",function(){return i.a}),n.d(e,"a",function(){return i.b}),n.d(e,"d",function(){return i.c}),n.d(e,"b",function(){return o.a}),n.d(e,"e",function(){return o.b})},function(t,e,n){"use strict";function i(t){n.i(r.a)(t)&&a.push(t)}function o(t){n.i(r.b)("onDeviceListen","",t),a.forEach(function(e){e(t)})}var r=n(2);e.a=i,e.b=o;var a=[]},function(t,e,n){"use strict";function i(t){n.i(a.a)(t)&&t()}function o(t){n.i(a.a)(t)&&c.push(t)}function r(){c.forEach(function(t){t()}),c=[]}var a=n(2);e.a=i,e.b=o,e.c=r;var c=[]},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e,n,i,a){i=i||"确定",a=a||"取消",HdIot.UI.alert({data:o()({title:t,message:e,okText:i,cancelText:a}),onListener:function(){r.a&&n()}})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(35),o=n(39),r=n(37),a=n(38),c=n(40);n.d(e,"alert",function(){return i.a}),n.d(e,"toast",function(){return o.a}),n.d(e,"showLoading",function(){return r.a}),n.d(e,"hideLoading",function(){return r.b}),n.d(e,"setWebViewTouchRect",function(){return a.a}),n.d(e,"toggleHeadAndFoot",function(){return c.a})},function(t,e,n){"use strict";function i(){HdIot.UI.showLoading({data:""})}function o(){HdIot.UI.hideLoading({data:""})}e.a=i,e.b=o},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e,i,a){var c=document.body.getBoundingClientRect();t=n.i(r.c)(t,c.width),e=n.i(r.c)(e,c.height),i=n.i(r.c)(i,c.width),a=n.i(r.c)(a,c.height);var u=o()({left:t,right:i,top:e,bottom:a});HdIot.UI.setTouchRect({data:u}),n.i(r.b)("setWebViewTouchRect",u,"")}},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e){e=e||3e3;var i=o()({data:{message:t,duration:e}});HdIot.UI.toast(i),n.i(r.b)("toast",i,"")}},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t){HdIot.UI.toggleHeadAndFoot({data:o()({show_head_foot:t})}),n.i(r.b)("toggleHeadAndFoot",t,"")}},function(t,e,n){"use strict";var i=n(2);e.a=function(t){HdIot.Util.getNetworkType({data:"",onListener:function(e){n.i(i.b)("getNetworkType","",e),n.i(i.a)(t)&&t(e)}})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(41),o=n(44),r=n(43),a=n(45);n.d(e,"getNetworkType",function(){return i.a}),n.d(e,"reload",function(){return o.a}),n.d(e,"post",function(){return r.a}),n.d(e,"sendNotification",function(){return a.a})},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e,i,a){var c=o()({url:t,data:e});HdIot.Util.post({data:c,onListener:function(t){n.i(r.a)(i)&&i(t),n.i(r.b)("post",c,t)}})}},function(t,e,n){"use strict";e.a=function(){HdIot.Util.reload({data:""})}},function(t,e,n){"use strict";var i=n(0),o=n.n(i),r=n(2);e.a=function(t,e){var i=o()({title:t,message:e});HdIot.Util.sendNotification({data:i}),n.i(r.b)("sendNotification",i,"")}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,n){t.exports=n(6)}],[87]);
//# sourceMappingURL=sdk.3e244f72c1aebbc0406c.js.map
webpackJsonp([1],[,function(t,n,e){t.exports={default:e(3),__esModule:!0}},function(t,n,e){"use strict";function i(t){return"function"==typeof t}function o(){var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=10*Math.random()|0;return("x"==t?n:3&n|8).toString(16)});return t=t.replace(/^0/,"1")}function r(){return window.device_uuid}function a(t,n,e){window.apiLog(t,n,e)}function c(t,n){if("number"==typeof t)return t;if("string"==typeof t){var e=parseInt(t);if(t.indexOf("%")>-1)return n*e/100;if(!isNaN(e))return e}return 0}n.a=i,n.d=o,n.e=r,n.b=a,n.c=c},function(t,n,e){var i=e(4),o=i.JSON||(i.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,n){var e=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=e)},,function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e(32),o=e(31),r=e(36),a=e(42);window.HdSmart={ready:i.a,onDeviceListen:i.b},window.apiLog=function(t,n,e){};var c=!1;window.onDeviceJsReady=function(){if(!window.HdIot)throw new Error("当前环境没有可用的api");c||(window.HdSmart.ready=i.c,window.HdSmart.Device=o,window.HdSmart.UI=r,window.HdSmart.Util=a,c=!0),i.d()},window.onDeviceChange=function(t){i.e(t)}},,,,,,,,,,,,,,,,,,,,function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n,i,a,c){var u=o()({method:t,req_id:e.i(r.d)(),params:{device_uuid:e.i(r.e)(),cmd:n,attr:i}});HdIot.Device.control({data:u,onListener:function(t){e.i(r.b)("control",u,t),e.i(r.a)(a)&&a(t)}})}},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n){var i=o()({method:"getDeviceLog",req_id:e.i(r.d)(),params:{device_uuid:e.i(r.e)(),start_time:t.start_time,items_per_page:"number"==typeof t.items_per_page?t.items_per_page:8,direction:t.direction}});HdIot.Device.getDeviceLog({data:i,onListener:function(t){e.i(r.b)("getDeviceLog",i,t),t=JSON.parse(t),e.i(r.a)(n)&&n(t.result)}})}},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n){var i=o()({method:"getDeviceLogByDay",req_id:e.i(r.d)(),params:{start_time:t,device_uuid:e.i(r.e)()}});HdIot.Device.getDeviceLogByDay({data:i,onListener:function(t){t=JSON.parse(t),e.i(r.b)("getDeviceLogByDay",i,t),e.i(r.a)(n)&&n(t)}})}},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n,i){var a=o()({method:"getDeviceMonthHistory",req_id:e.i(r.d)(),params:{device_uuid:e.i(r.e)(),year:t,month:n}});HdIot.Device.getDeviceMonthHistory({data:a,onListener:function(t){e.i(r.b)("getDeviceMonthHistory",a,t),t=JSON.parse(t),e.i(r.a)(i)&&i(t)}})}},function(t,n,e){"use strict";var i=e(2);n.a=function(t,n){HdIot.Device.getSnapShot({data:"",onListener:function(o){e.i(i.b)("getSnapShot","",o),o=JSON.parse(o),o.result?e.i(i.a)(t)&&t(o.result,o.timestamp||o.result.timestamp):e.i(i.a)(n)&&n(o)}})}},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e(26),o=e(30),r=e(27),a=e(28),c=e(29);e.d(n,"control",function(){return i.a}),e.d(n,"getSnapShot",function(){return o.a}),e.d(n,"getDeviceLog",function(){return r.a}),e.d(n,"getDeviceLogByDay",function(){return a.a}),e.d(n,"getDeviceMonthHistory",function(){return c.a})},function(t,n,e){"use strict";var i=e(34),o=e(33);e.d(n,"c",function(){return i.a}),e.d(n,"a",function(){return i.b}),e.d(n,"d",function(){return i.c}),e.d(n,"b",function(){return o.a}),e.d(n,"e",function(){return o.b})},function(t,n,e){"use strict";function i(t){e.i(r.a)(t)&&a.push(t)}function o(t){e.i(r.b)("onDeviceListen","",t),a.forEach(function(n){n(t)})}var r=e(2);n.a=i,n.b=o;var a=[]},function(t,n,e){"use strict";function i(t){e.i(a.a)(t)&&t()}function o(t){e.i(a.a)(t)&&c.push(t)}function r(){c.forEach(function(t){t()}),c=[]}var a=e(2);n.a=i,n.b=o,n.c=r;var c=[]},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n,e,i,a){i=i||"确定",a=a||"取消",HdIot.UI.alert({data:o()({title:t,message:n,okText:i,cancelText:a}),onListener:function(){r.a&&e()}})}},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e(35),o=e(39),r=e(37),a=e(38),c=e(40);e.d(n,"alert",function(){return i.a}),e.d(n,"toast",function(){return o.a}),e.d(n,"showLoading",function(){return r.a}),e.d(n,"hideLoading",function(){return r.b}),e.d(n,"setWebViewTouchRect",function(){return a.a}),e.d(n,"toggleHeadAndFoot",function(){return c.a})},function(t,n,e){"use strict";function i(){HdIot.UI.showLoading({data:""})}function o(){HdIot.UI.hideLoading({data:""})}n.a=i,n.b=o},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n,i,a){var c=document.body.getBoundingClientRect();t=e.i(r.c)(t,c.width),n=e.i(r.c)(n,c.height),i=e.i(r.c)(i,c.width),a=e.i(r.c)(a,c.height);var u=o()({left:t,right:i,top:n,bottom:a});HdIot.UI.setTouchRect({data:u}),e.i(r.b)("setWebViewTouchRect",u,"")}},function(t,n,e){"use strict";n.a=function(t,n){n=n||3e3,HdIot.UI.toast(t,n)}},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t){HdIot.UI.toggleHeadAndFoot({data:o()({show_head_foot:t})}),e.i(r.b)("toggleHeadAndFoot",t,"")}},function(t,n,e){"use strict";var i=e(2);n.a=function(t){HdIot.Util.getNetworkType({data:"",onListener:function(n){e.i(i.b)("getNetworkType","",n),e.i(i.a)(t)&&t(n)}})}},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e(41),o=e(44),r=e(43),a=e(45);e.d(n,"getNetworkType",function(){return i.a}),e.d(n,"reload",function(){return o.a}),e.d(n,"post",function(){return r.a}),e.d(n,"sendNotification",function(){return a.a})},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n,i,a){var c=o()({url:t,data:n});HdIot.Util.post({data:c,onListener:function(t){e.i(r.a)(i)&&i(t),e.i(r.b)("post",c,t)}})}},function(t,n,e){"use strict";n.a=function(){HdIot.Util.reload({data:""})}},function(t,n,e){"use strict";var i=e(1),o=e.n(i),r=e(2);n.a=function(t,n){var i=o()({title:t,message:n});HdIot.Util.sendNotification({data:i}),e.i(r.b)("sendNotification",i,"")}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,n,e){t.exports=e(6)}],[87]);
//# sourceMappingURL=sdk.3a1f91934dce3c1ef8b9.js.map
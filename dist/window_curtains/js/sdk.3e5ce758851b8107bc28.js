!function(t){function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var e={};n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="./",n(n.s=11)}([function(t,n,e){t.exports={default:e(13),__esModule:!0}},,function(t,n){var e=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=e)},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,e){t.exports=!e(6)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,n,e){var o=e(8),r=e(9);t.exports=function(t){return o(r(t))}},function(t,n,e){var o=e(31);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==o(t)?t.split(""):Object(t)}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n){var e=Math.ceil,o=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?o:e)(t)}},function(t,n,e){t.exports=e(12)},function(t,n,e){"use strict";function o(t){return"function"==typeof t}function r(){var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=10*Math.random()|0;return("x"==t?n:3&n|8).toString(16)});return t=t.replace(/^0/,"1")}function i(){return window.device_uuid}function u(t,n,e){window.apiLog(t,n,e)}function c(t,n){if("number"==typeof t)return t;if("string"==typeof t){var e=parseInt(t);if(t.indexOf("%")>-1)return n*e/100;if(!isNaN(e))return e}return 0}function a(t){o(t)&&t()}function f(t){o(t)&&x.push(t)}function s(){u("ready","",""),x.forEach(function(t){t()}),x=[]}function p(t){o(t)&&y.push(t)}function d(t){u("onDeviceListen","",t),y.forEach(function(n){n(t)})}function l(){HdIot.UI.showLoading({data:""})}function v(){u("hideLoading","",""),HdIot.UI.hideLoading({data:""})}Object.defineProperty(n,"__esModule",{value:!0});var x=[],y=[],h={ready:a,beforeReady:f,runReadyCallbacks:s,onDeviceListen:p,runDeviceListenCallback:d},g=e(0),w=e.n(g),b=function(t,n,e,c,a,f){var s=w.a({method:t,req_id:r(),params:{device_uuid:i(),cmd:n,attribute:e}}),p=!1,d=setTimeout(function(){p=!0,u("control","",{result:"超时"}),a()},f||8e3);return HdIot.Device.control({data:s,onListener:function(t){if(p)return!1;clearTimeout(d),t=JSON.parse(t),u("control",s,t),504==t.code?a(t):o(c)&&c()}}),d},m=function(t,n){HdIot.Device.getSnapShot({data:"",onListener:function(e){u("getSnapShot","",e),e=JSON.parse(e),e.result?o(t)&&t(e.result,e.timestamp||e.result.timestamp):o(n)&&n(e)}})},_=e(14),O=e.n(_),S=e(0),I=e.n(S),j=function(t,n,e,c){var a=I.a({method:t,req_id:r(),params:O.a({device_uuid:i()},n)});HdIot.Device.postRequest({method:t,data:a,onListener:function(n){u("postRequest_"+t,a,n),n=JSON.parse(n),504==n.code?o(c)&&c(n):n.result&&o(e)&&e(n.result)}})},H={control:b,getSnapShot:m,postRequest:j},L=e(0),N=e.n(L),T=function(t,n,e,r,i){r=r||"确定",i=i||"取消",HdIot.UI.alert({data:N.a({title:t,message:n,okText:r,cancelText:i}),onListener:function(){o&&e()}})},E=e(0),M=e.n(E),R=function(t,n){n=n||3e3;var e=M.a({data:{message:t,duration:n}});HdIot.UI.toast(e),u("toast",e,"")},P=e(0),U=e.n(P),k=function(t,n,e,o){var r=document.body.getBoundingClientRect();t=c(t,r.width),n=c(n,r.height),e=c(e,r.width),o=c(o,r.height);var i=U.a({left:t,right:e,top:n,bottom:o});HdIot.UI.setTouchRect({data:i}),u("setWebViewTouchRect",i,"")},D=e(0),C=e.n(D),F=function(t){HdIot.UI.toggleHeadAndFoot({data:C.a({show_head_foot:t})}),u("toggleHeadAndFoot",t,"")},J={alert:T,toast:R,showLoading:l,hideLoading:v,setWebViewTouchRect:k,toggleHeadAndFoot:F},q=function(t){HdIot.Util.getNetworkType({data:"",onListener:function(n){u("getNetworkType","",n),o(t)&&t(n)}})},A=function(){HdIot.Util.reload({data:""})},W=e(0),B=e.n(W),G=function(t,n,e,r){var i=B.a({url:t,data:n});HdIot.Util.post({data:i,onListener:function(t){o(e)&&e(t),u("post",i,t)}})},V=e(0),z=e.n(V),K=function(t,n){var e=z.a({title:t,message:n});HdIot.Util.sendNotification({data:e}),u("sendNotification",e,"")},Q={getNetworkType:q,reload:A,post:G,sendNotification:K};window.HdSmart={ready:h.beforeReady,onDeviceListen:h.onDeviceListen},window.apiLog=function(t,n,e){};var X=!1;window.onDeviceJsReady=function(){if(!window.HdIot)throw new Error("当前环境没有可用的api");X||(window.HdSmart.ready=h.ready,window.HdSmart.Device=H,window.HdSmart.UI=J,window.HdSmart.Util=Q,X=!0),h.runReadyCallbacks()},window.onDeviceChange=function(t){h.runDeviceListenCallback(t)}},function(t,n,e){var o=e(2),r=o.JSON||(o.JSON={stringify:JSON.stringify});t.exports=function(t){return r.stringify.apply(r,arguments)}},function(t,n,e){t.exports={default:e(15),__esModule:!0}},function(t,n,e){e(16),t.exports=e(2).Object.assign},function(t,n,e){var o=e(17);o(o.S+o.F,"Object",{assign:e(27)})},function(t,n,e){var o=e(3),r=e(2),i=e(18),u=e(20),c=function(t,n,e){var a,f,s,p=t&c.F,d=t&c.G,l=t&c.S,v=t&c.P,x=t&c.B,y=t&c.W,h=d?r:r[n]||(r[n]={}),g=h.prototype,w=d?o:l?o[n]:(o[n]||{}).prototype;d&&(e=n);for(a in e)(f=!p&&w&&void 0!==w[a])&&a in h||(s=f?w[a]:e[a],h[a]=d&&"function"!=typeof w[a]?e[a]:x&&f?i(s,o):y&&w[a]==s?function(t){var n=function(n,e,o){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,o)}return t.apply(this,arguments)};return n.prototype=t.prototype,n}(s):v&&"function"==typeof s?i(Function.call,s):s,v&&((h.virtual||(h.virtual={}))[a]=s,t&c.R&&g&&!g[a]&&u(g,a,s)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,n,e){var o=e(19);t.exports=function(t,n,e){if(o(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,o){return t.call(n,e,o)};case 3:return function(e,o,r){return t.call(n,e,o,r)}}return function(){return t.apply(n,arguments)}}},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n,e){var o=e(21),r=e(26);t.exports=e(5)?function(t,n,e){return o.f(t,n,r(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n,e){var o=e(22),r=e(23),i=e(25),u=Object.defineProperty;n.f=e(5)?Object.defineProperty:function(t,n,e){if(o(t),n=i(n,!0),o(e),r)try{return u(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var o=e(4);t.exports=function(t){if(!o(t))throw TypeError(t+" is not an object!");return t}},function(t,n,e){t.exports=!e(5)&&!e(6)(function(){return 7!=Object.defineProperty(e(24)("div"),"a",{get:function(){return 7}}).a})},function(t,n,e){var o=e(4),r=e(3).document,i=o(r)&&o(r.createElement);t.exports=function(t){return i?r.createElement(t):{}}},function(t,n,e){var o=e(4);t.exports=function(t,n){if(!o(t))return t;var e,r;if(n&&"function"==typeof(e=t.toString)&&!o(r=e.call(t)))return r;if("function"==typeof(e=t.valueOf)&&!o(r=e.call(t)))return r;if(!n&&"function"==typeof(e=t.toString)&&!o(r=e.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,e){"use strict";var o=e(28),r=e(39),i=e(40),u=e(41),c=e(8),a=Object.assign;t.exports=!a||e(6)(function(){var t={},n={},e=Symbol(),o="abcdefghijklmnopqrst";return t[e]=7,o.split("").forEach(function(t){n[t]=t}),7!=a({},t)[e]||Object.keys(a({},n)).join("")!=o})?function(t,n){for(var e=u(t),a=arguments.length,f=1,s=r.f,p=i.f;a>f;)for(var d,l=c(arguments[f++]),v=s?o(l).concat(s(l)):o(l),x=v.length,y=0;x>y;)p.call(l,d=v[y++])&&(e[d]=l[d]);return e}:a},function(t,n,e){var o=e(29),r=e(38);t.exports=Object.keys||function(t){return o(t,r)}},function(t,n,e){var o=e(30),r=e(7),i=e(32)(!1),u=e(35)("IE_PROTO");t.exports=function(t,n){var e,c=r(t),a=0,f=[];for(e in c)e!=u&&o(c,e)&&f.push(e);for(;n.length>a;)o(c,e=n[a++])&&(~i(f,e)||f.push(e));return f}},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n,e){var o=e(7),r=e(33),i=e(34);t.exports=function(t){return function(n,e,u){var c,a=o(n),f=r(a.length),s=i(u,f);if(t&&e!=e){for(;f>s;)if((c=a[s++])!=c)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===e)return t||s||0;return!t&&-1}}},function(t,n,e){var o=e(10),r=Math.min;t.exports=function(t){return t>0?r(o(t),9007199254740991):0}},function(t,n,e){var o=e(10),r=Math.max,i=Math.min;t.exports=function(t,n){return t=o(t),t<0?r(t+n,0):i(t,n)}},function(t,n,e){var o=e(36)("keys"),r=e(37);t.exports=function(t){return o[t]||(o[t]=r(t))}},function(t,n,e){var o=e(3),r=o["__core-js_shared__"]||(o["__core-js_shared__"]={});t.exports=function(t){return r[t]||(r[t]={})}},function(t,n){var e=0,o=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+o).toString(36))}},function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n){n.f={}.propertyIsEnumerable},function(t,n,e){var o=e(9);t.exports=function(t){return Object(o(t))}}]);
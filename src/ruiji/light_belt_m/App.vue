<template>
  <div>
    <new-top-bar :scroll="true" title="灯带控制"></new-top-bar>
    <status-tip></status-tip>
    <p>画布：</p>
    <canvas id="myCanvas" width="375" height="300" style="border:1px solid #d3d3d3;background:#ffffff;">
      Your browser does not support the HTML5 canvas tag.
    </canvas>
  </div>
</template>

<script>
  import NewTopBar from '@lib/components/NewTopBar.vue'
  import StatusTip from '@lib/components/StatusTip.vue'
  import color from '@/ruiji/light_belt_m/assets/color.png'
  export default {
    components: {
      NewTopBar,
      StatusTip
    },
    mounted() {
      var c = document.getElementById("myCanvas");
      var ctx = c.getContext("2d");
      let that = this
      this.preImage(color,function(img){
        ctx.drawImage(img,10,10,100,100);
        let colors = ctx.getImageData(80,30,1,1)
        console.log('color=====', that.getPixelColor(colors))
        ctx.fillStyle = that.getPixelColor(colors).hex
        ctx.fillRect(0,200,100,100)
      })
    },
    methods: {
      preImage(url, callback) {
        var img = new Image(); //创建一个Image对象，实现图片的预下载
        img.src = url;

        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
          callback(img);
          return; // 直接返回，不用再处理onload事件
        }

        img.onload = function () { //图片下载完毕时异步调用callback函数。
          callback(img);//将回调函数的this替换为Image对象
        }
      },
      getPixelColor(imageData) {
        var pixel = imageData.data;
        var r = pixel[0];
        var g = pixel[1];
        var b = pixel[2];
        var a = pixel[3] / 255;
        a = Math.round(a * 100) / 100;
        var rHex = r.toString(16);
        r < 16 && (rHex = "0" + rHex);
        var gHex = g.toString(16);
        g < 16 && (gHex = "0" + gHex);
        var bHex = b.toString(16);
        b < 16 && (bHex = "0" + bHex);
        var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
        var hexColor = "#" + rHex + gHex + bHex;
        return {
          rgba: rgbaColor,
          rgb: rgbColor,
          hex: hexColor,
          r: r,
          g: g,
          b: b,
          a: a
        }
      },
      touchmove(e) {
        console.log('e======', e)
      },
      touchmove1(e) {
        console.log('e1111======', e)
      },
      test() {
        console.log('nihao')
      }
    }
  }
</script>

<style>
  body{
    height: 100vh;
    background-color: #19191C;
  }

</style>

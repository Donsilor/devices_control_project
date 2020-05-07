<template>
  <div>
    <new-top-bar :scroll="true" title="灯带控制"></new-top-bar>
    <status-tip></status-tip>
    <canvas @touchstart="touchStart" @touchmove="touchMove" ref="canvas" width="375" height="375">
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
    data(){
      return{
        context:null,
        top:0
      }
    },
    mounted() {
      var canvas = this.$refs.canvas
      console.log('canvas====', canvas.offsetTop)
      this.top = canvas.offsetTop
      this.context = canvas.getContext("2d");
      let that = this
      let context = this.context
      this.preImage(color,function(img){
        context.drawImage(img,0,0,375,375);
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
      touchStart(e) {
        console.log('touchStart======', e.touches[0])
        this.colorChange(e.touches[0])
      },
      touchMove(e) {
        console.log('touchMove======', e.touches[0])
        this.colorChange(e.touches[0])
      },
      colorChange(touchPoint) {
        let colors = this.context.getImageData(touchPoint.clientX,touchPoint.clientY-this.top,1,1)
        this.context.fillStyle = this.getPixelColor(colors).hex
        this.context.fillRect(0,200,50,50)
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

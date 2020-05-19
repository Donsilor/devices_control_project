<template>
  <div>
    <div>
      <canvas
        id="canvasId"
        width="300"
        height="300"
        class="mycanvas"/>
    </div>
    <div :style="{'background-color': selectColor}"/>
  </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex'
    export default {
        name: "Draw",
        data() {
          return {
              canvas: null,
              ctx: '',
              ox: '',
              oy: '',
              or: '',
              br: '',
              moveFlag: false,
              linearGradientArr: [{
                  step: '0',
                  color: '#ffde3a'
              }, {
                  step: '0.2',
                  color: '#79ffc5'
              }, {
                  step: '0.4',
                  color: '#8eb5fe'
              }, {
                  step: '0.6',
                  color: '#ffffff'
              }, {
                  step: '0.8',
                  color: '#cd7efe'
              },
                  {
                      step: '1.0',
                      color: '#ff6b2d'
                  }
              ],
              selectColor: 'rgba(255, 0, 0)',
              rgbValue: ''
          }
        },
        computed: {
          ...mapGetters(['isClose', 'isOffline', 'networkStatus']),
          ...mapState(['device', 'deviceAttrs']),
        },
        mounted() {
            let _this = this
            let isMove = false
            this.canvas = document.getElementById("canvasId")
            this.ctx = this.canvas.getContext("2d")
            let width = this.canvas.width
            let height = this.canvas.height
            // 解决canvas的模糊问题
            if (window.devicePixelRatio) {
                this.canvas.style.width = width + "px"
                this.canvas.style.height = height + "px"
                this.canvas.height = height * window.devicePixelRatio
                this.canvas.width = width * window.devicePixelRatio
                this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
            }
            // this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
            this.ox = 150
            this.oy = 150
            this.or = 130
            this.br = 20
            this.moveFlag = false
            var on = ("ontouchstart" in document)? {
                start: "touchstart", move: "touchmove", end: "touchend"
            } : {
                start: "mousedown", move: "mousemove", end: "mouseup"
            }
            this.canvas.addEventListener(on.start, function(e) {
                if(_this.deviceAttrs.switch_status != 'on') return
                _this.moveFlag = true
            }, false)

            this.canvas.addEventListener(on.move, function(e) {
              if(e.preventDefault){
                  e.preventDefault()
              }else{
                  e.returnValue = false
              }
              if(_this.deviceAttrs.switch_status != 'on') return
              isMove = true
                if (_this.moveFlag) {
                    var k = _this.getXY(e,_this.canvas)
                    var r = Math.atan2(k.x-_this.ox, _this.oy-k.y)
                    var hd = (Math.PI+r)/(2*Math.PI)
                    // console.log('k', k)
                    // console.log('r', r)
                    // console.log('hd', hd)
                    _this.draw(hd)
                }
            }, false)

            this.canvas.addEventListener(on.end, function(e) {
              if(_this.deviceAttrs.switch_status != 'on') return
                _this.moveFlag = false
                if (isMove) {
                  _this.$emit('rgb', _this.rgbValue)
                }
              isMove = false
            }, false)
            this.draw(0.125)

        },
        methods: {
            getXY(e,obj) {
                var et = e.touches? e.touches[0] : e
                // console.log('et', et)
                var x = et.clientX
                var y = et.clientY
                // console.log('x', x)
                // console.log('y', y)
                return {
                    x : x - obj.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),
                    y : y - obj.offsetTop  + (document.body.scrollTop || document.documentElement.scrollTop),
                    screenX: x
                }
            },
            draw(n) {
                // console.log('draw的参数n', n)
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
                this.ctx.strokeStyle = "#99a"
                this.ctx.lineWidth = 20
                this.ctx.beginPath()
                // this.ctx.arc(this.ox,this.oy,this.or,1/4 * Math.PI,3/4 * Math.PI,true);//270度圆(逆时针)
                this.ctx.arc(this.ox,this.oy,this.or,0,2*Math.PI,true)//整圆
                this.ctx.stroke()
                // 画一个渐变
                var gradient = this.ctx.createLinearGradient(this.ox, this.oy * 2, this.ox, 0)
                this.linearGradientArr.forEach(element => {
                    gradient.addColorStop(element.step, element.color)
                })
                this.ctx.strokeStyle = gradient
                this.ctx.beginPath()
                this.ctx.lineWidth = 20
                this.ctx.arc(this.ox,this.oy,this.or,0,2*Math.PI, false)
                this.ctx.lineCap = "round"
                this.ctx.stroke()


                var d =  this.offset(n*2*Math.PI,this.or)
                // console.log('d', d)
                let getColor = this.ctx.getImageData((this.ox+d.x)*window.devicePixelRatio, (this.oy+d.y)*window.devicePixelRatio, 1, 1).data
                // let getColor = this.ctx.getImageData((200+d.x), (200+d.y), 1, 1).data
                this.selectColor = `rgba(${getColor[0]}, ${getColor[1]}, ${getColor[2]})` //
                this.rgbValue = `${getColor[0]},${getColor[1]},${getColor[2]}`
                // console.log('选中的颜色', getColor)

                this.ctx.beginPath()
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
                this.ctx.arc(this.ox, this.oy, 80, 0, 2*Math.PI)
                this.ctx.fill()
                this.ctx.fillStyle = this.selectColor //内部的灰色圆形

                //内部选中的颜色圆环
                this.ctx.strokeStyle = this.selectColor
                this.ctx.lineWidth = 6
                this.ctx.beginPath()
                this.ctx.arc(this.ox, this.oy, 40, 0, 2*Math.PI, true)
                this.ctx.stroke()
                // 内部两个同心圆

                this.ctx.strokeStyle = '#ccc'
                this.ctx.lineWidth = 1
                this.ctx.beginPath()
                this.ctx.arc(this.ox, this.oy, 10, 0, 2*Math.PI, true)
                this.ctx.stroke()
                this.ctx.beginPath()
                this.ctx.arc(this.ox, this.oy, 6, 0, 2*Math.PI, true)
                this.ctx.stroke()

                this.ctx.beginPath()
                this.ctx.arc(this.ox+d.x,this.oy+d.y,this.br,0,2*Math.PI,true)
                this.ctx.fill()
                // 随滑动的两个圆
                this.ctx.beginPath()
                this.ctx.arc(this.ox + (d.x*(0.76)), this.oy +  (d.y*(0.76)) ,this.br - 12, 0, 2*Math.PI, true)
                this.ctx.fill()

                this.ctx.beginPath()
                this.ctx.arc(this.ox + (d.x*(0.6)), this.oy +  (d.y*(0.6)) ,this.br - 16, 0, 2*Math.PI, true)
                this.ctx.fill()

                // var imageData = this.ctx.getImageData(0,0,this.canvas.width, this.canvas.height)
                // console.log(imageData, '==============')
                // var data = imageData.data

                // // 求出每个像素的灰色，然后把改变后的像素信息重新添加到canvas中
                // // var grayscale = function() {
                //   for (var i = 0; i < data.length; i += 4) {
                //     // var avg = (data[i] + data[i +1] + data[i +2]) / 3
                //     // data[i]     = avg // red
                //     // data[i + 1] = avg // green
                //     // data[i + 2] = avg // blue
                //     var r = data[i],
                //             g = data[i+1],
                //             b = data[i+2],
                //             a = data[i+3]
                //   }
                // console.log(r,g,b,a, '-----------------------')
                // //   this.ctx.putImageData(imageData, 0, 0)
                // // }
                // let data2 = this.canvas.toDataURL()
                // console.log(data2)
                // let img = document.createElement('img')
                // img.src = data2
                // document.body.appendChild(img)
             },
            offset(r,d) {//根据弧度与距离计算偏移坐标
                // console.log('offset传入的d', d)
                return {x: -Math.sin(r)*d, y: Math.cos(r)*d}
            }
        }
    }
</script>

<style scoped>
 .mycanvas{
    /*zoom: 0.5;*/
    /* width: 300PX !important;
    height: 300PX !important; */
    width: 550px !important;
    height: 550px !important;
 }
</style>

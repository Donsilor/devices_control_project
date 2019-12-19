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
              selectColor: 'rgba(255, 0, 0)'
          }
        },
        mounted() {
            let _this = this
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
                _this.moveFlag = true
            }, false)

            this.canvas.addEventListener(on.move, function(e) {
                if (_this.moveFlag) {
                    var k = _this.getXY(e,_this.canvas)
                    var r = Math.atan2(k.x-_this.ox, _this.oy-k.y)
                    var hd = (Math.PI+r)/(2*Math.PI)
                    console.log('k', k)
                    console.log('r', r)
                    console.log('hd', hd)
                    _this.draw(hd)
                }
            }, false)

            this.canvas.addEventListener(on.end, function(e) {
                _this.moveFlag = false
            }, false)
            this.draw(0.125)
        },
        methods: {
            getXY(e,obj) {
                var et = e.touches? e.touches[0] : e
                console.log('et', et)
                var x = et.clientX
                var y = et.clientY
                console.log('x', x)
                console.log('y', y)
                return {
                    x : x - obj.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),
                    y : y - obj.offsetTop  + (document.body.scrollTop || document.documentElement.scrollTop),
                    screenX: x
                }
            },
            draw(n) {
                console.log('draw的参数n', n)
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
                console.log('d', d)
                let getColor = this.ctx.getImageData((this.ox+d.x)*window.devicePixelRatio, (this.oy+d.y)*window.devicePixelRatio, 1, 1).data
                // let getColor = this.ctx.getImageData((200+d.x), (200+d.y), 1, 1).data
                this.selectColor = `rgba(${getColor[0]}, ${getColor[1]}, ${getColor[2]})` //
                console.log('选中的颜色', getColor)

                this.ctx.beginPath()
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
                this.ctx.arc(this.ox, this.oy, 106, 0, 2*Math.PI)
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
                this.ctx.arc(this.ox + (d.x*(0.76)), this.oy +  (d.y*(0.76)) ,this.br - 8, 0, 2*Math.PI, true)
                this.ctx.fill()

                this.ctx.beginPath()
                this.ctx.arc(this.ox + (d.x*(0.6)), this.oy +  (d.y*(0.6)) ,this.br - 14, 0, 2*Math.PI, true)
                this.ctx.fill()
             },
            offset(r,d) {//根据弧度与距离计算偏移坐标
                console.log('offset传入的d', d)
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
    width: 600px !important;
    height: 600px !important;
 }
</style>

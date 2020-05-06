<template>
  <div id="app">
    <canvas id="canvas" width="300" height="300" ref="canvas"></canvas>
    <!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
  // import HelloWorld from './components/HelloWorld.vue'

  export default {
    name: 'Canvas',
    data() {
      return {
        context: null,
        currentValue:0,
      }
    },
    components: {},
    mounted() {
      setInterval( ()=> {
        let value = Math.random()
        console.log('value====', value)
        this.controlRate(value)
      },5000)

    },
    methods: {
      controlRate(n){
        if (n>this.currentValue){
          this.currentValue=1.03*this.currentValue + 0.01
          // console.log('this.currentValue====',this.currentValue)
          if (this.currentValue <n){
            requestAnimationFrame(()=> {
              this.controlRate(n)
            })
          } else {
            this.currentValue = n
          }
        } else {
          this.currentValue =0.98*this.currentValue -0.01
          if (this.currentValue >n){
            requestAnimationFrame(()=> {
              this.controlRate(n)
            })
          } else {
            this.currentValue = n
          }
        }
        this.draw(this.currentValue)
      },
      draw(n) {
        let radio = Math.PI * 3/4 + 3/2*Math.PI*n
        if (!this.context) {
          this.context = this.$refs.canvas.getContext('2d')
        }
        let context = this.context
        context.clearRect(0,0,300,300)
        context.beginPath()
        context.arc(150, 150, 50, Math.PI * 3/4, Math.PI * 1/4, false)
        // context.closePath()
        context.strokeStyle = 'red'
        context.lineWidth='5'
        context.stroke()
        context.beginPath()
        context.arc(150, 150, 50, Math.PI * 3/4, radio, false)
        context.strokeStyle = 'yellow'
        context.lineWidth='6'
        context.lineCap='round'
        context.stroke()
        context.beginPath()
        context.fillStyle='green'
        context.arc(150+50 * Math.cos(radio), 150+50 * Math.sin(radio), 10, 0, Math.PI * 2, false)
        context.fill()
      }
    }
  }
</script>

<style>
  #canvas {
    border: 1px solid lightblue;
  }
</style>

<template>
  <div class="body">
    <div
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page', {'scroll44': classTrue}]"
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"/>
      <!-- <StatusTip v-show="device.device_uuid"/> -->
      <div class="main center">
        <div class="wrap-circle">
          <div class="showtemp">
            <div
              v-if="loaclAttr.connectivity == 'offline'||loaclAttr.switchStatus=='off'||loaclAttr.mode=='wind'"
              class="tm">-- <sup>°C</sup></div>
            <div
              v-if="!isOffline&& loaclAttr.switchStatus == 'on'&&loaclAttr.mode!=='auto'&&loaclAttr.mode!='wind'"
              class="tm">{{ thermography }}<sup>°C</sup>
            </div>
          </div>
          <canvas
            ref="canvas"
            class="canvas"
            width="560"
            height="560"
          />
          <div
            class="control-tm center">
            <button
              ref="reduce"
              :disabled="setTemperatureDis"
              class="control reduce btn"
              @click="setTemperature('reduce',-70)"
            />
            <button
              ref="add"
              :disabled="setTemperatureDis"
              class="control add btn"
              @click="setTemperature('add',70)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
const [MIN_TEMP, MAX_TEMP] = [0, 1000]
export default {
  data() {
    return {
      isOpen: false,
      isShow: true,
      width: 250,
      radius: 8,
      progress: 30, // 0~70
      duration: 0,
      delay: 0,
      // barColor: '#D8D8D8',
      backgroundColor: '#ececec',
      timeShow: false,
      typeVal: 'hand',
      brightnessValue: 0,
      rangStyle: '',
      opcityStyle: 'opcity-0',
      animation:false,
      loaclAttr: {},
            //圆的数据
      ox:140,
      oy:140,
      or:130,
      br:10,
      moveFlag:false,
      thermography:0,//摄氏度
      ctx: '',
      //记录温度
      thermography:16,
      setTemperatureDis:false,
      moveEnd:false,
      hscrolll: 0,
      hscrolltopp: 0,
      classTrue: false
    }
  },

  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    isClose(){
      return this.loaclAttr.switchStatus == 'on'?false:true
    },
    isOffline(){
      return this.loaclAttr.connectivity == 'online'?false:true
    },
  },
  watch: {
    "deviceAttrs"() {
      this.loaclAttr = this.deviceAttrs
      // this.reset()
      console.log('=============', this.loaclAttr.mode)
    },
    "device.stateChange"(){
        this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
            this.draw(`${0.125+0.046875*(this.loaclAttr.temperature/10-16)}`)
          // this.reset()
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  mounted(){
    this.ctx = this.$refs.canvas.getContext("2d")
    this.ctx.scale(2,2)
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    offset(r,d) {//根据弧度与距离计算偏移坐标
      return {x: -Math.sin(r)*d, y: Math.cos(r)*d}
    },
    draw(n) {
      this.ctx.clearRect(0,0,this.$refs.canvas.width,this.$refs.canvas.height)
      // this.ctx.strokeStyle = "rgba(0,0,0,0.05)"
      this.ctx.strokeStyle = "#FFF"
      this.ctx.lineWidth = 7
      this.ctx.beginPath()
      this.ctx.shadowColor =  "none"
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.shadowBlur = 0
      this.ctx.lineCap = 'round'
      this.ctx.arc(this.ox,this.oy,this.or,1/4 * Math.PI,3/4 * Math.PI,true)//半圆(逆时针)
      // this.ctx.arc(this.ox,this.oy,this.or,0,2*Math.PI,true);//整圆
      this.ctx.stroke()
      if (this.loaclAttr.switchStatus=='on'&&!this.isOffline) {
          if (this.loaclAttr.mode == 'heat') {
            console.log('heat111')
            this.ctx.strokeStyle = "#DA6C00"
          }else if(this.loaclAttr.mode == 'cold'){
            console.log('cold111')
            this.ctx.strokeStyle = "#008CDA"
          }else if(this.deviceAttrs.mode=='dehumidify'){
            console.log('else')
            this.ctx.strokeStyle = "#E1B96E"
          }
      }else{
        this.ctx.strokeStyle = "transparent"
      }

      this.ctx.lineWidth = 7
      this.ctx.beginPath()
      this.ctx.shadowColor =  "none"
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.shadowBlur = 0
      this.ctx.arc(this.ox,this.oy,this.or,3/4 *Math.PI,(n*2+0.5)*Math.PI,false)
      // this.ctx.arc(this.ox,this.oy,this.or,0.5*Math.PI,(n*2+0.5)*Math.PI,false);
      this.ctx.stroke()
      this.ctx.fillStyle = "transparent"
      this.ctx.font = "70px PingFangSC-Light"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.fillText(Math.round((n*(100/0.75))+(0-((100*0.125)/0.75)))+"℃",this.ox,this.oy)
      this.thermography = Math.round((n*(100/0.75))+(0-((100*0.125)/0.75)))
      this.ctx.fillStyle = "#fff"
      this.ctx.beginPath()
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 2
      this.ctx.shadowBlur = 4
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      let d =  this.offset(n*2*Math.PI,this.or)
      // console.log('d', d)
      // 关机显示
      if (this.loaclAttr.switchStatus=='on'&&!this.isOffline&&this.deviceAttrs.mode!=='wind'&&this.deviceAttrs.mode!=='auto') {
        this.ctx.arc(this.ox+d.x,this.oy+d.y,this.br,0,2*Math.PI,true)
      }else{
        //开机显示
        this.ctx.arc(0,0,0,0,0,true)
      }
      this.ctx.fill()
    },
    getXY(e,obj) {
        let et = e.touches? e.touches[0] : e
        let x = et.clientX
        let y = et.clientY
        return {
            x : x - obj.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)-30,
            y : y - obj.offsetTop  + (document.body.scrollTop || document.documentElement.scrollTop) -145
        }
    },
    controlDevice(attr, value) {
      // console.log(this.loaclAttr,'-------------------------------------')

      let param = {}
      return this.doControlDevice({
        nodeid: `airconditioner.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...param
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .canvas{
    position:absolute;
    transform:scle(2);
    zoom:0.5;
  }
</style>
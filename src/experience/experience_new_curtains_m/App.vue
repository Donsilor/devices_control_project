/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div class="page">
      <topbar
        :title="device.device_name"
        bak-color="#000" />
      <div class="main center">
        <div
          ref="isgray"
          class="isgray" >
          <div
            ref="cover"
            :class="['cover']">
            <div
              ref="touchbox"
              class="touchbox"
              @touchstart="touchStart($event)"
              @touchmove="touchMove($event)"
              @touchend="touchEnd($event)">
              <div
                class="touch"/>
            </div>
          </div>
        </div>
        <div class="ruler">
          <ul>
            <li
              v-for="i in 11"/>
          </ul>
        </div>
        <div 
          v-if="curtainStatus === 'opening'" 
          class="status">正在打开窗帘</div>
        <div 
          v-if="curtainStatus === 'closing'" 
          class="status">正在关闭窗帘</div>
        <div 
          v-if="curtainStatus === 'opened'" 
          class="status">窗帘已打开</div>
        <div 
          v-if="curtainStatus === 'closed'"
          class="status" >窗帘已关闭</div>
      </div>
      <!-- 底部按钮 -->
      <div class="panel-btn center">
        <div class="btn-wrap">
          <div
            :class="[{'active': curtainStatus === 'opening' },'btn-open btn center']"
            @click="setOpen" />
          <div class="btn-name">全开</div>
        </div>
        <div class="btn-wrap">
          <div
            ref="btn-pause"
            :class="['btn-pause btn center']"
            @click="setPause" />
          <div class="btn-name">暂停</div>
        </div>
        <div
          class="btn-wrap"
        >
          <div
            :class="[{ 'active': curtainStatus === 'closing' }, 'btn btn-close center']"
            @click="setClose" />
          <div class="btn-name">全关</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      //  target_percentage: 50,
      // 点击中部到指定幅度按钮显示的信息
      coverWidth:"",
      timeId: '',
      curtainStatus: ''
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    bakColor(){
      return this.isClose ? '#000' : '#fff'
    }
  },
  watch: {
    'device.stateChange'(){
      this.$nextTick(()=>{
         this.newRatio()
                  //如果窗帘幅度发生改变
        //  if (this.deviceAttrs.open_percentage) {
        //    this.newRatio()
        //  }
         if (this.deviceAttrs.open_percentage=='100') {
           this.curtainStatus='窗帘已关闭'
         }
         if (this.deviceAttrs.open_percentage=='0') {
           this.curtainStatus='窗帘已打开'
         }
      })
    }
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{
          this.newRatio()
      })
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    setPause() {
      // this.curtainStatus = 'opened'
      this.$refs['btn-pause'].classList.add('active')
      setTimeout(() => {
        this.$refs['btn-pause'].classList.remove('active')
      }, 500)
      clearInterval(this.timeId)
      let maxW = this.$refs.isgray.offsetWidth - 14
      let cover = this.$refs.cover
      let s = cover.offsetWidth-14
      let pauseRange = s/maxW*100
      // console.log('窗帘的最大宽度', maxW)
      // console.log('cover宽度', s)
      console.log('暂停的百分比计算（cover宽度 / 窗帘的最大宽度 * 100）', pauseRange)
      // this.controlDevice('open_percentage', pauseRange,{'switch':'pause'})
      this.controlDevice('switch', 'pause')
      // .then(()=>{
      //   this.controlDevice('switch', 'on')
      // })
    },
    // 全开
    setOpen(){
      this.controlDevice('switch', 'on')
    },
    //全关
    setClose(){
      this.controlDevice('switch', 'off')
    },
    // setMode(val) {
    //   if (val=='0') {
    //     this.animate(this.$refs.cover, 14, -1, 15).then(() => {
    //       // this.controlDevice('open_percentage', val)
    //       this.controlDevice('switch', 'on')
    //     })
    //   }
    //   if (val=='100') {
    //     this.animate(this.$refs.cover, 572, 1, 15).then(() => {
    //       // this.controlDevice('open_percentage', val)
    //       this.controlDevice('switch', 'off')
    //     })
    //   }
    // },
    touchStart(e){
      console.log(e)
    },
    touchMove(e){
      e.stopPropagation()
      e.preventDefault()
      let cover = this.$refs.cover
      let w = e.targetTouches[0].pageX - cover.offsetLeft
      let maxW = this.$refs.isgray.offsetWidth
      w=w<=14?14:w
      w=w>=maxW?maxW :w
      cover.style.width = w+"px"
      this.coverWidth=w-14
    },
    touchEnd(e){
      e.stopPropagation()
      e.preventDefault()
      let maxW = this.$refs.isgray.offsetWidth-14
      let range =Math.round(this.coverWidth/maxW*100)
      console.log(this.coverWidth)
      console.log(maxW)
      console.log(range)
      this.controlDevice('open_percentage', range)
    },
    newRatio(){
       // let maxW = this.$refs.isgray.offsetWidth-14
       let maxW = document.querySelector('.isgray').clientWidth-14
      console.log('窗帘的最大宽度api', maxW)
      this.coverWidth = this.deviceAttrs.open_percentage/100*maxW
      console.log(this.deviceAttrs.open_percentage,1111111111)
      
      let cover = this.$refs.cover
       cover.style.width = this.coverWidth +14+"px"
      console.log('窗帘的赋值宽度为', this.coverWidth+"px")
    },
    controlDevice(attr, value,params) {
      return this.doControlDevice({
        nodeid: `curtain.main.${attr}`,
        params: {
          attribute: {
            [attr]: value,
            ...params
          }
        }
      })
    },
    animate(el, target, step, dtime) {
      return new Promise ((resolve, reject) => {
        /**
         * 参数说明：
         * - el       表示操作的元素对象
         * - target   表示移动的目标距离 单位 px
         * - step     表示步长，即每次移动的距离 单位 px
         * - dtime    表示移动的间隔时间 单位 ms
         */

        // 步长和间隔时间设置了默认值
        step = step || 10
        dtime = dtime || 30

        // 判断是否开启定时器，如果有就清除
        if (this.timeId) {
          clearInterval(this.timeId)
          this.timeId = null
        }

        // 开启一个定时器，并将定时器挂载道当前元素上
        this.timeId = setInterval(() => {
          let moveWidth = +(document.querySelector('.cover').style.width.replace('px', ''))
          let fixedWidth = document.querySelector('.isgray').clientWidth
          let str = el.style.width.replace('px', '')
          if (step > 0) {
            this.curtainStatus = 'closing'
          } else {
            this.curtainStatus = 'opening'
          }
          if (step > 0 && moveWidth / fixedWidth > 1) {
            clearInterval(this.timeId)
            this.timeId = ''
            this.curtainStatus = 'closed'
            resolve()
            return
          }
          if (step < 0 && moveWidth / fixedWidth < 0.04) {
            clearInterval(this.timeId)
            this.timeId = ''
            resolve()
            this.curtainStatus = 'opened'
            return
          }
          var current = parseInt(str)
          current = current ? current : 0

          // 定时器每执行一次，就让元素移动一个 步长
          el.style.width = current + step + 'px'
        }, dtime)
      })
    }
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';

.body {
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background-image: url('~@lib/@{imgPath}/bg_01@2x.png');
  background-size: 100% 100%;
  .main {
    position: relative;
    &.center {
      flex-direction: column;
    }
    .cover{
      width: 572px;
      height: 204px;
      left: 0;
      top: 0px;
      background-image: linear-gradient(-90deg, #E5B864 3%, #F1CB85 52%);
      border-radius: 1px;
      position: absolute;
      clip:rect(0px 572px 204px 0px);
      .touchbox{
        width: 28px;
        height: 204px;
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        .touch{
          width: 12px;
          height: 65px;
          border-left: 2px solid #BF954C;
          border-right: 2px solid #BF954C;
        }
      }
      &.move{
        transition: 5s linear;
      }
      &.openCurtains{
        animation: open 5s linear;
      }
      &.closeCurtains{
        animation: close 5s linear;
      }
      &.pause{
        animation-play-state: paused;
      }
      @-webkit-keyframes open {
        0% {
          width: 0px;
        }
        100% {
          width: 572px;
        }
      }
      @-webkit-keyframes close {
          0% {
          width: 572px;
        }
        100% {
          width: 28px;
        }
      }

    }
    .isgray {
      width: 75%;
      height: 204px;
      background: rgb(234, 235, 238);
      border-radius: 1px;
      margin-top: 25vh;
      position: relative;
    }
    .ruler{
      width: 572px;
      height: 60px;
      margin-top: 34px;
      ul{
        width: 100%;
        // padding: 0 28px;
        padding-left: 28px;
        display: flex;
        justify-content: space-between;
        li{
          width: 1px;
          height: 24px;
          background-color: rgba(0, 0, 0,.26);
          position: relative;
          &::before{
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            color: #000;
          }
          &:first-child::before{
            content: "0";
          }
          &:nth-child(3)::before{
            content: "20";
          }
          &:nth-child(5)::before{
            content: "40";
          }
           &:nth-child(7)::before{
            content: "60";
          }
           &:nth-child(9)::before{
            content: "80";
          }
           &:nth-child(11)::before{
            content: "100";
          }
        }

      }
    }
    .status{
      font-size: 28px;
      height: auto;
      margin-top: 120px;
    }
  }
  .panel-btn {
    height: auto;
    width: 100%;
    position: fixed;
    bottom: 130px;
    z-index: 99999;
    .btn {
      margin-top: 24px;
      width: 100%;
      height: 306px;
      border-radius: 40px 40px 0 0;
      background: rgba(136, 138, 137,.4);
      overflow: hidden;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    &.center{
      display: flex;
      align-items: center;
    }
  }
  /*********** 按钮 ***********/
  .btn-wrap {
    margin: 0 34px 40px;
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        background: #000000;
        &.btn-open::before{
          background-image: url('~@lib/@{imgPath}/dakai2@2x.png');
          background-size: 100% 100%;
        }
        &.btn-pause::before{
          background-image: url('~@lib/@{imgPath}/zanting2@2x.png');
          background-size: 100% 100%;
        }
        &.btn-close::before{
          background-image: url('~@lib/@{imgPath}/guanbi2@2x.png');
          background-size: 100% 100%;
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
      line-height: 40px;
      // opacity: .5;
    }

    .btn-open {
      &::before {
        background-image: url('~@lib/@{imgPath}/dakai@2x.png');
        background-size: 100% 100%;
      }
    }
    .btn-pause {
      &::before {
        background-image: url('~@lib/@{imgPath}/zanting@2x.png');
        background-size: 100% 100%;
      }
    }
    .btn-close {
      &::before {
        background-image: url('~@lib/@{imgPath}/guanbi@2x.png');
        background-size: 100% 100%;
      }
    }
    }
  }
  &.close,
  &.offline {
    &:before {
      content: "";
      position: fixed;
      top: 64PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 999;
      width: 100%;
      // background: rgba(0, 0, 0, 0.1);
    }
    &.page {
      background: #fff;
      .panel-btn {
        background: #fff;
      }
    }
    .panel-btn {
      background: #efefef;
    }
    .btn-wrap {
      opacity: .2;
      &.up-index {
        opacity: 1;
        .btn-open{
          z-index:999999;
        }
      }
      .btn {
        &.active {
           &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
        }
      }
    }
  }
</style>

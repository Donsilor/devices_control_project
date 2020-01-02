<template>
  <div>
    <!-- <div>
      选中值为：<span>{{ selectedValue }}</span>
    </div> -->
    <div class="wrap-box">
      <div class="border"/>
      <div class="opacity"/>
      <div class="opacity1"/>
      <div class="box">
        <ul 
          :style="{ top: hTop+0.85 +'rem' }" 
          class="list" 
          @touchstart="touchStart($event,'hours')" 
          @touchmove="touchMove($event,'hours')" 
          @touchend="touchEnd($event, 'hours')">
          <li class="current-pre"/>
          <li 
            v-for="(it, idx) in dataList.hours"
            :key="idx"
            :class="{'current-pre': hIndex!==idx,
                     'current':hIndex===idx}">{{ +idx > 9 ? idx : '0' + idx }}</li>
        </ul>
        <div class="time">小时</div>
      </div>
      <div class="box">
        <ul 
          :style="{ top: mTop+0.85 +'rem' }" 
          class="list" 
          @touchstart="touchStart($event,'minute')" 
          @touchmove="touchMove($event,'minute')" 
          @touchend="touchEnd($event,'minute')">
          <li class="current-pre"/>
          <li 
            v-for="(it, idx) in dataList.minute"
            :key="idx"
            :class="{'current-pre': mIndex!==idx,
                     'current':mIndex===idx}">{{ it == 1 ? '00': '30' }}</li>
        </ul>
        <div class="time1">分钟</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fontSize: 75,
        liheight: 50,
        dataList: {
          hours: 24,
          minute: 2,
        },

        hIndex: 0, // 小时选中下标
        mIndex: 0,

        selectedValue: '00:00', //选中值
        oldTop: null,  // 单位为px
        top1: null, //从touchstart到touchmove记忆top位置 单位为px
        hTop: 0, //用于ul列表定位 单位为rem
        mTop: 0, //用于ul列表定位 单位为rem
      }
    },
    watch: { //监听器
      selectedValue(value) { //选择值
        this.$emit('selectedchange', value) //自定义事件，暴露值
      }
    },
    mounted() {
      this.$nextTick(() =>{
        this.fontSize = document.documentElement.style.fontSize.replace('px', '')
      })
    },
    methods: {
      touchStart(e, type) {
        e.stopPropagation()
        e.preventDefault()
        // this.liheight =  document.getElementsByClassName('current-pre')[0].offsetHeight // 精度有问题

        let el = document.getElementsByClassName("current-pre")[0]
        this.liheight = window.getComputedStyle(el,null)
                              .getPropertyValue("height").replace('px', '')

        this.oldTop = e.targetTouches[0].pageY // 获取的 pageY 单位为px
        if(type === 'minute'){
          this.top1 = this.mTop * this.fontSize // 转换成px
        } else {
          this.top1 = this.hTop * this.fontSize // 转换成px
        }
      },
      touchMove(e, type) {
        e.stopPropagation()
        e.preventDefault()
        if(event.targetTouches.length == 1) {
          var touch = event.targetTouches[0]
          let distance = touch.pageY - this.oldTop + this.top1 // 滑动距离 + 选中的top

          if(type === 'minute'){
            this.mIndex = Math.floor(-distance / this.liheight)
            this.mTop = distance / this.fontSize // 转换成 rem
          } else {
            this.hIndex = Math.floor(-distance / this.liheight)
            this.hTop = distance / this.fontSize // 转换成 rem
          }
          this.selectedValue = this.hIndex + ':' + this.mIndex
        }
      },
      touchEnd(e, type) {
        e.stopPropagation() //阻止冒泡
        e.preventDefault() //阻止默认行为
        let max = this.dataList[type]
        console.log('-----touchEnd-----')
        if(type === 'minute'){
          if(this.mIndex < 0 ){
            this.mIndex = 0
          } else if(this.mIndex > max -1){
            this.mIndex = max -1
          }
          this.mTop = - (this.mIndex * this.liheight) / this.fontSize
        } else {
          if(this.hIndex < 0 ){
            this.hIndex = 0
          } else if(this.hIndex > max -1){
            this.hIndex = max - 1
          }
          this.hTop = - (this.hIndex * this.liheight) / this.fontSize
          console.log(this.hTop)
          
        }
        this.selectedValue = this.hIndex + ':' + this.mIndex
        console.log(this.selectedValue)
        
      },
    }
  }
</script>

<style lang="less" scoped>
  div,
  ul,
  li {
    margin: 0;
    padding: 0;
  }
  .wrap-box{
    height: 350px;
    margin: 64px 0;
    padding: 0 48px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .border{
    // position: fixed;
    position: absolute;
    border: 1px solid rgba(.0, .0, .0, .05);
    width: 88%;
    height: 113px;
    border-right: none;
    border-left: none;
  }
  // .opacity,.opacity1{
  //   opacity: 0.5;
  //   width: 100%;
  //   height: 60px;
  //   position: absolute;
  //   border: 1px solid rgba(.0, .0, .0, 1);
  // }
  // .opacity{
  //   top: -18px;
  // }
  // .opacity1{
  //   bottom: -18px;
  // }
  .box {
    // flex: 1;
    // height: 260px;
    height: 380px;
    overflow: hidden;
    position: relative;
    .time{
      position: fixed;
      bottom: 312px;
      left: 206px;
      font-size: 24px;
      color: #000;
    }
    .time1{
      position: fixed;
      bottom: 312px;
      right: 206px;
      font-size: 24px;
      color: #000;
    }
    .list {
      position: relative;
      flex: 1;
      margin: 0 120px;
      text-align: center;
    }
    
    .list li {
      box-sizing: border-box;
      user-select: none;
      transform-origin: center center;
    }
    /*滚动样式*/
    
    li.current {
      font-size: 40px;
      color: #E1B96E;
      height: 114px;
      line-height: 114px;
      transform: translateZ(0px) rotateX(0deg);
      font-family: PingFangSC-Medium;
    }
    li.current-pre{
      // background-image: linear-gradient(-180deg, rgba(55,62,65,0.00) 0%, #373E41 100%);
      border-radius: 0px;
      height: 70px;
      line-height: 70px;
      color: #808080;
      font-family: PingFangSC-Regular;
      font-size: 32px;
      transform: translateZ(-20px) rotateX(40deg);
    }
    li.up-pre{
      background-image: linear-gradient(-180deg, rgba(55,62,65,0.00) 0%, #373E41 100%);
    }
    li.down-pre{
      background-image: linear-gradient(180deg, rgba(55,62,65,0.00) 0%, #373E41 100%);
    }
  }
  .unit{
    // flex: 1;
    height: 114px;
    line-height: 114px;
    font-size: 34px;
    color: #FFC600;
    text-align: center;
  }

</style>


<template>
  <div>
    <div class="wrap-box">
      <div class="box box1">
        <ul
          :style="{ top: tTop+0.85 +'rem' }"
          class="list"
          @touchstart="touchStart($event,'temperature')"
          @touchmove="touchMove($event,'temperature')"
          @touchend="touchEnd($event, 'temperature')">
          <li class="current-pre"/>
          <li
            v-for="(it, idx) in dataList.temperature"
            :key="idx"
            :class="{'current-pre': tIndex!==idx,
                     'current':tIndex===idx}">{{ +it > 9 ? it : '0' + it }}</li>
        </ul>
      </div>
      <div class="unit">°C</div>
      <div class="box box2">
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
      </div>
      <div class="unit">小时</div>
      <div :class="['box', {'min-box': hIndex == 5}]">
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
                     'current':mIndex===idx}">{{ +idx > 9 ? idx : '0' + idx }}</li>
        </ul>
      </div>
      <div class="unit">分钟</div>
      <div class="border-box"/>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      activeMode: {
        type: Number
      }
    },
    data() {
      const getTemp = function(start, end) {
        let arr = []
        for (let i = start; i < end + 1; i++) {
          arr.push(i)
        }
        return arr
      }
      return {
        fontSize: 75,
        liheight: 50,
        dataList: {
          hours: 6,
          minute: 60,
          temperature: getTemp(30, 100)
        },
        hIndex: 0, // 小时选中下标
        mIndex: 30,
        tIndex: 70,
        // tIndex: 0,
        selectedValue: '00:00', //选中值
        oldTop: null,  // 单位为px
        top1: null, //从touchstart到touchmove记忆top位置 单位为px
        hTop: 0, //用于ul列表定位 单位为rem
        mTop: -27.99, //用于ul列表定位 单位为rem
        tTop: -65.31
        // tTop: 0
      }
    },
    watch: { //监听器
      selectedValue(value) { //选择值
        this.$emit('selectedchange', value) //自定义事件，暴露值
      },
      activeMode(value) {

        if (value === 0) {
          // 普通蒸
          this.tTop = -65.31
          this.tIndex = 70
          this.dataList.temperature = this.getTemp(30, 100)
        } else if (value === 1) {
          //过温度蒸
          this.tTop = 0
          this.tIndex = 0
          this.dataList.temperature = this.getTemp(110, 110)
        } else if (value === 2) {
          //解冻：温度设置范围40℃-50℃
          this.tTop = -9.33
          this.tIndex = 10
          this.dataList.temperature = this.getTemp(40, 50)
        } else {
          // 除垢
          this.dataList.temperature = this.getTemp(110, 110)
        }
      }
    },
    mounted() {
      this.$nextTick(() =>{
        this.fontSize = document.documentElement.style.fontSize.replace('px', '')
      })
    },
    methods: {
      touchStart(e, type) {
        console.log('touchStart')
        e.stopPropagation()
        e.preventDefault()
        let el = document.getElementsByClassName("current-pre")[0]
        this.liheight = window.getComputedStyle(el,null)
                              .getPropertyValue("height").replace('px', '')

        this.oldTop = e.targetTouches[0].pageY // 获取的 pageY 单位为px
        if(type === 'minute'){
          this.top1 = this.mTop * this.fontSize // 转换成px
        } else if (type === 'hours') {
          this.top1 = this.hTop * this.fontSize // 转换成px
        } else {
          this.top1 = this.tTop * this.fontSize // 转换成px
        }
      },
      touchMove(e, type) {
        console.log('touchMove')
        e.stopPropagation()
        e.preventDefault()
        if(event.targetTouches.length == 1) {
          var touch = event.targetTouches[0]
          let distance = touch.pageY - this.oldTop + this.top1 // 滑动距离 + 选中的top

          if(type === 'minute'){
            this.mIndex = Math.floor(-distance / this.liheight)
            this.mTop = distance / this.fontSize // 转换成 rem
          } else if (type === 'hours') {
            this.hIndex = Math.floor(-distance / this.liheight)
            this.hTop = distance / this.fontSize // 转换成 rem
          } else {
            this.tIndex = Math.floor(-distance / this.liheight)
            this.tTop = distance / this.fontSize // 转换成 rem
          }
          this.selectedValue = this.tIndex + ':' + this.hIndex + ':' + this.mIndex
        }
      },
      touchEnd(e, type) {
        e.stopPropagation() //阻止冒泡
        e.preventDefault() //阻止默认行为
        let max = this.dataList[type]
        if (type === 'temperature') {
          if (this.dataList[type].length === 1) {
            max = 1
          } else {
            max = (this.dataList[type][this.dataList[type].length -1] - this.dataList[type][0]) + 1
          }
        }
        console.log('-----touchEnd-----')
        if(type === 'minute'){
          if(this.mIndex < 0 ){
            this.mIndex = 0
          } else if(this.mIndex > max -1){
            this.mIndex = max -1
          }
          this.mTop = - (this.mIndex * this.liheight) / this.fontSize
        } else if (type === 'hours') {
          if(this.hIndex < 0 ){
            this.hIndex = 0
          } else if(this.hIndex > max -1){
            this.hIndex = max - 1
          }
          this.hTop = - (this.hIndex * this.liheight) / this.fontSize
          console.log(this.hTop)
        } else {
          if(this.tIndex < 0 ){
            this.tIndex = 0
          } else if(this.tIndex > max -1){
            this.tIndex = max - 1
          }
          this.tTop = - (this.tIndex * this.liheight) / this.fontSize
          console.log(this.tTop)
        }
        this.selectedValue = this.tIndex + ':' + this.hIndex + ':' + this.mIndex
        console.log(this.selectedValue)
        if (this.hIndex == 5) {
          this.$nextTick(() => {
            this.mTop = 0
            this.mIndex = 0
          })
        }
      },
      getTemp(start, end) {
        let arr = []
        for (let i = start; i < end + 1; i++) {
          arr.push(i)
        }
        return arr
      }
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
    height: 250px;
    margin: 64px 0;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    .border-box{
      width: 100%;
      height: 120px;
      position: absolute;
      bottom: 0;
      border-top: 1px solid rgba(.0, .0, .0, .3);
      border-bottom: 1px solid rgba(.0, .0, .0, .3);
      z-index: 0;
    }
  }
  .box {
    flex: 1;
    height: 248px;
    overflow: hidden;
    position: relative;
    z-index: 99;
    .list {
      position: relative;
      flex: 1;
      text-align: center;
    }

    .list li {
      box-sizing: border-box;
      user-select: none;
      transform-origin: center center;
      font-size: 32px;
      color: #888;
    }
    /*滚动样式*/

    li.current {
      font-size: 100px;
      color: #000000;
      height: 114px;
      line-height: 114px;
      transform: translateZ(0px) rotateX(0deg);
      /*border-top: 1px solid rgba(.0, .0, .0, .3);*/
      /*border-bottom: 1px solid rgba(.0, .0, .0, .3)*/
    }
    li.current-pre{
      // background-image: linear-gradient(-180deg, rgba(55,62,65,0.00) 0%, #373E41 100%);
      border-radius: 0px;
      font-size: 48px;
      height: 70px;
      line-height: 70px;
      color: #888;
      transform: translateZ(-20px) rotateX(40deg);
    }
    li.up-pre{
      background-image: linear-gradient(-180deg, rgba(55,62,65,0.00) 0%, #373E41 100%);
    }
    li.down-pre{
      background-image: linear-gradient(180deg, rgba(55,62,65,0.00) 0%, #373E41 100%);
    }
  }
  .box1{
    flex: none;
    width: 180px;
  }
  .box2{
    padding-left: 100px;
  }
  .unit{
    // flex: 1;
    height: 114px;
    line-height: 180px;
    font-size: 24px;
    color: #000000;
    text-align: center;
    /*border-top: 1px solid rgba(.0, .0, .0, .3);*/
    /*border-bottom: 1px solid rgba(.0, .0, .0, .3)*/
  }
  .min-box{
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 9999;
    }
  }
</style>


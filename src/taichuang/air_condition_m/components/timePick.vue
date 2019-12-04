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
            v-for="(it, idx) in newDataList"
            :key="idx"
            :class="{'current-pre': hIndex!==idx,
                     'current':hIndex===idx}">{{ it.speed }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      speedType:{type: String}//0,1,2,3,4,5,6
    },
    data() {
      return {
        fontSize: 75,
        liheight: 50,
        dataList: [{
            speed:'自动',
            index: '0'
          },
          {
           speed:'低风',
            index:'1'
          },
          {
           speed:'中低风',
            index:'2'
          },
          {
           speed:'中风',
            index:'3'
          },
          {
           speed:'中高风',
            index:'4'
          },
          {
           speed:'高风',
            index:'5'
          },
          {
           speed:'强风',
            index:'6'
          },
        ],
        newDataList:[],
        hIndex: 0, // 小时选中下标
        mIndex: 0,

        selectedValue: '0', //选中值
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
           let num11 = this.speedType.split(',')
        console.log(num11,'555555')
        
        this.newDataList = this.dataList.filter( item =>{
           return num11.indexOf(item.index) > -1
        })
        console.log(this.newDataList,'ddddd')
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
      touchMove(e) {
        e.stopPropagation()
        e.preventDefault()
        if(event.targetTouches.length == 1) {
          var touch = event.targetTouches[0]
          let distance = touch.pageY - this.oldTop + this.top1 // 滑动距离 + 选中的top
            this.hIndex = Math.floor(-distance / this.liheight)
            this.hTop = distance / this.fontSize // 转换成 rem
          
          this.selectedValue = this.hIndex + ':' + this.mIndex
        }
      },
      touchEnd(e) {
        e.stopPropagation() //阻止冒泡
        e.preventDefault() //阻止默认行为
        let max = this.newDataList.length
        console.log('-----touchEnd-----')
          if(this.hIndex < 0 ){
            this.hIndex = 0
          } else if(this.hIndex > max -1){
            this.hIndex = max - 1
          }
          this.hTop = - (this.hIndex * this.liheight) / this.fontSize
        // this.selectedValue = this.hIndex 
        this.selectedValue = this.newDataList[this.hIndex].index
        console.log(this.selectedValue,'选中的值')    
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
      font-size: 36px;
      color: #000;
      height: 114px;
      line-height: 114px;
      transform: translateZ(0px) rotateX(0deg);
      font-family: PingFangSC-Light;
    }
    li.current-pre{
      // background-image: linear-gradient(-180deg, rgba(55,62,65,0.00) 0%, #373E41 100%);
      border-radius: 0px;
      height: 70px;
      line-height: 70px;
      color: #808080;
      font-family: PingFangSC-Light;
      font-size: 30px;
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


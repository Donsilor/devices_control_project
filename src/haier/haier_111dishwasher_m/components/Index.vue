/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar
        :title="device.device_name"
        :shutdown="true"
        bak-color="#000"
        @shutdownCallback="shutdowncallback('off')" />
      <!-- tab切换栏 -->
      <div
        class="main center"
        style="margin-top:52px">
        <div class="tab">
          <ul>
            <li
              :class="[{'active':temp},'tablist']"
              @click="tabMode(true)">
              <img
                v-show="temp"
                src="../../../../lib/base/dishwasher/assets/canju@2x.png">
              <img
                v-show="!temp"
                src="../../../../lib/base/dishwasher/assets/canju2@2x.png">
              <span >餐具</span>
            </li>
            <li
              :class="[{'active':!temp},'tablist']"
              @click="tabMode(false)">
              <img
                v-show="temp"
                src="../../../../lib/base/dishwasher/assets/shiwu@2x.png">
              <img
                v-show="!temp"
                src="../../../../lib/base/dishwasher/assets/shiwu2@2x.png">
              <span >食材</span>
            </li>
          </ul>
          <!-- 左右滑动选择 -->
          <!-- 餐具 -->
          <div
            v-if="temp"
            class="swiper-container container">
            <div class="swiper-wrapper">
              <div
                v-for="item in tableware"
                class="swiper-slide">
                <div>
                  <span>{{ item.time }}</span>
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 食材 -->
          <div
            v-if="!temp"
            class="swiper-container container1">
            <div class="swiper-wrapper">
              <div
                v-for="item in foodList"
                class="swiper-slide">
                <div>
                  <span>{{ item.time }}</span>
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!isClose&&!isOffline"
        class="panel-btn center">
        <div
          class="btn-wrap">
          <div
            :class="[{'active':deviceAttrs.control == 'start'},'btn-start btn center']"
            @click="setStart" />
          <div class="btn-name">启动</div>
        </div>
      </div>
      <!-- 关机状态 -->
      <div
        v-else
        class="closed">请在设备端打开电源</div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      temp:true,
      timeOutEvent:'',
      a:"",
      currentMode:'normal',
      tableware:[
        {
          name:'除味',
          time:37,
          english:'taste_removal'
        },
        {
          name:'密胺',
          time:106,
          english:'melamine'
        },
        {
          name:'玻璃',
          time:81,
          english:'glass'
        },
        {
          name:'冲洗',
          time:20,
          english:'flush'
        },
        {
          name:'智能',
          time:74,
          english:'smart'
        }
        ,
        {
          name:'标准',
          time:126,
          english:'normal'
        }
        ,
        {
          name:'强力',
          time:91,
          english:'strong'
        }
        ,
        {
          name:'即时',
          time:47,
          english:'timely'
        }
        ,
        {
          name:'节能',
          time:136,
          english:'energy_saving'
        }
        ,
        {
          name:'蒸汽',
          time:100,
          english:'vapor'
        }
      ],
      foodList:[
        {
          name:'水果',
          time:28,
          english:'fruit'
        },
        {
          name:'浆果',
          time:29,
          english:'berries'
        },
        {
          name:'核果',
          time:30,
          english:'stone_fruit'
        },
        {
          name:'仁果',
          time:30,
          english:'pome_fruit'
        },
        {
          name:'瓜果',
          time:32,
          english:'melons'
        }
        ,
        {
          name:'蔬菜',
          time:34,
          english:'vegetables'
        }
        ,
        {
          name:'叶菜',
          time:36,
          english:'leaf_vegetable'
        }
        ,
        {
          name:'根菜',
          time:39,
          english:'root_vegetable'
        }
        ,
        {
          name:'茎菜',
          time:36,
          english:'stem_vegetable'
        }
        ,
        {
          name:'果实',
          time:33,
          english:'fruit_vegetable'
        },
        {
          name:'食用菌',
          time:37,
          english:'ediblefungi'
        }
        ,
        {
          name:'海鲜',
          time:35,
          english:'seafood'
        }
        ,
        {
          name:'甲壳',
          time:35,
          english:'crustaceans'
        }
        ,
        {
          name:'贝类',
          time:38,
          english:'testaceans'
        }
        ,
        {
          name:'螺类',
          time:40,
          english:'snails'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isClose','isOffline']),
    ...mapState(['device', 'deviceAttrs']),
    bakColor(){
      return this.isClose ? '#000' : '#fff'
    },

  },
  watch: {
    'device.stateChange'(){
      this.$nextTick(()=>{
        //  this.newRatio()
      })
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(()=>{

      })
      // HdSmart.UI.setStatusBarColor(2)
    })
  },
  // 初始化swiper
   mounted(){
        var mySwiper = new Swiper('.swiper-container', {
          width:384,
          autoplay:false,
          centeredSlides: true,
          loop:true,
          slidesPerView: 4,
          paginationClickable: true,
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,//修改swiper的父元素时，自动初始化swiper
        })
      },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 开关机
    shutdowncallback(val){
      if (this.isOffline) return 
      this.controlDevice('switch',val)
    },
    // tab切换
    tabMode(t){
      this.temp = t
    },
    // 启动
    setStart() {
      let controlStatus = ''
      if (this.deviceAttrs.control == 'start') {
        controlStatus = 'halt'
      } else {
        controlStatus = 'start'
        this.currentMode = document.querySelectorAll('.swiper-slide-active>div>span')[1].innerHTML
        let value
        let arr = this.tableware.concat(this.foodList)
        for(let i=0;i<arr.length;i++){
          if(this.currentMode ==arr[i].name ){
            value = arr[i].english
          }
        }
        this.controlDevice("mode",value).then(()=>{
          this.controlDevice("control",controlStatus)
        })  
          this.$router.push({ path: '/Washing' })
        return
      }
      this.controlDevice("control",controlStatus )
    },
    // 长按事件
    touchStart(e){
      console.log(e)
      this.timeOutEvent=setTimeout(() => {
        this.longPress()
      }, 1000)
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    touchMove(e){
      clearTimeout(this.timeOutEvent)
      this.timeOutEvent=0
    },
    touchEnd(e){
      clearTimeout(this.timeOutEvent)//清除定时器
      this.timeOutEvent=0
      if(this.timeOutEvent!=0){
          // alert("你这是点击，不是长按")
        // this.$refs.black.className.add('active')
      }
      return false
    },
    longPress(){
      this.timeOutEvent = 0
      console.log(this.timeOutEvent)
      // alert('长按了')
      this.$nextTick(()=>{
        this.controlDevice('remain_washtime',0)
      })
    },
    // 洗涤完成
    finish(){
      this.controlDevice('operation_mode','standby')
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
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/new_curtains/assets';
@imgPath1: 'base/dishwasher/assets';
@keyframes progress-bar{
  0% {
      transform: rotate(260deg);
      border: 3px solid transparent;
  }
  100% {
      transform: rotate(358deg);
      border: 3px solid rgba(0, 0, 0, 1);
  }
}
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
       .tab{
         ul {
          width: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          li{
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 4px solid rgba(0,0,0,0.08);;
            width: 324px;
            height: 132px;
            font-size: 32px;
            color: rgba(0,0,0,0.4);
            img{
              height: 45px;
              width: 45px;
            }
            &.active{
              border-bottom: 4px solid #000;
              span{
                color: #000;
              }
            }
          }
        }
        .container {
          margin-left: 38%;
          height: 300px;
        }
        .container1 {
          margin-left: 40.6%;
          height: 300px;
        }
        .swiper-wrapper{
          .swiper-slide{
            position:relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 40px;
            width: 9%;
            &.swiper-slide-active{
              margin-right: 40px;
              margin-left: 40px;
              width: 19%;
              padding: 0;
              >div{
                opacity: 1;
                position:absolute;
                bottom: 0;
                >span{
                  &:first-of-type{
                    font-size: 160px;
                    position: relative;
                    margin-bottom: 18px;
                    &::before{
                      display: block;
                      content: '分钟';
                      position: absolute;
                      top: -14px;
                      right: -30px;
                      font-size: 12px;
                    }
                  }
                }
              }
            }
            >div{
              position:absolute;
              bottom: 0;
                  font-size: 48px;
                  color: #000;
                  opacity: .6;
                  display: flex;
                  flex-direction: column;
                  text-align: center;
                }
          }
        }
       }
  }
  .working{
    margin-top: 20vh;
    .time{
      width: 100%;
      font-size: 146px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }
    .progress{
      font-size:28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin:24px 0 70px 0;
      .isgray{
        color:#b0b0b0;
        &.ongoing{
          color: #000;
        }
         &.black{
          color: #000;
        }
      }
      
      
    }
    .status{
      width: 100%;
      font-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .end{
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20vh;
    .circle{
      width: 140px;
      height: 140px;
      border: 2px solid rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      margin-bottom: 60px;
      &::before{
        display: block;
        content: '√';
        text-align: center;
        line-height: 140px;
      }
    }
    >span{
      font-size: 48px;
    }
    .button{
      width: 90%;
      height: 100px;
      background: #000;
      color: #fff;
      font-size: 32px;
      text-align: center;
      line-height: 100px;
      margin-top: 30vh;
    }
  }
  .closed{
    font-size: 48px;
    text-align: center;
    margin-top: 240px;
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
    position: relative;
    .progressBar {
      &::before{
        content: "";
        display: block;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        top: -30px;
        left: -23%;
        // transform: translateX(-50%) rotate(260deg);
        border: 3px solid rgba(0, 0, 0, 1);
        clip: rect(0px 200px 40px 0px);
        animation: progress-bar 1s linear infinite;
      }
    }
    .mask {
      &::before{
        content: "";
        display: block;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        position: absolute;
        top: -30px;
        left: -23%;
        border: 3px solid transparent;
        z-index: 10;
        clip: rect(40px 80px 200px 0px);
      }
    }
      .press{
        &::before{
          content: "";
          display: block;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          border: 3px solid rgba(136, 138, 137, 0.8);
          clip: rect(0px 200px 40px 0px);
        }
      }
    .btn {
      box-sizing: border-box;
      margin: 0px auto;
      width: 140px;
      height: 140px;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.btn-over{
        &.active{
          background:#000;
        }
      }
    &.btn-swich {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(136, 138, 137,.4);
      &::before {
        background-image: url('~@lib/@{imgPath1}/yiguanbi.png');
        background-size: 100% 100%;
        width: 80px;
        height: 80px;
      }
    }
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        &.btn-start::before{
          background-image: url('~@lib/@{imgPath1}/zanting.png');
          background-size: 100% 100%;
          width: 88px;
          height: 102px;
        }
        &.btn-over::before{
          background-image: url('~@lib/@{imgPath1}/jieshu2.png');
          background-size: 100% 100%;
          width: 96px;
          height: 96px;
        }
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 28px;
      line-height: 40px;
      // opacity: .5;
    }

    .btn-over {
      &::before {
        background-image: url('~@lib/@{imgPath1}/jieshu.png');
        background-size: 100% 100%;
        width: 96px;
        height: 96px;
      }
    }
    .btn-start {
      &::before {
        background-image: url('~@lib/@{imgPath1}/qidong@2x.png');
        background-size: 100% 100%;
        width: 88px;
        height: 102px;
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
      ul{
        li{
          opacity: 0;
        }
      }
      .swiper-container{
        opacity: .2;
      }
      .swiper-container1{
        opacity: .2;
      }
    }
    .btn-wrap {
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

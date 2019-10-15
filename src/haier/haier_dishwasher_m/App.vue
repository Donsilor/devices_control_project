/* eslint-disable vue/no-unused-vars */
<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']">
      <NewTopBar 
        :title="device.device_name"
        :shutdown="true"
        bak-color="#000"
        @click="shutdowncallback(off)" />
      <div 
        v-show="deviceAttrs.control=='stop'&&deviceAttrs.remain_washtime=='0'" 
        class="main center"
        style="margin-top:52px">
        <div class="tab">
          <ul>
            <li 
              :class="[{'active':temp},'tablist']" 
              @click="tabMode(true)">
              <img 
                v-show="temp" 
                src="../../../lib/base/dishwasher/assets/canju@2x.png">
              <img 
                v-show="!temp" 
                src="../../../lib/base/dishwasher/assets/canju2@2x.png">
              <span >餐具</span>
            </li>
            <li
              :class="[{'active':!temp},'tablist']" 
              @click="tabMode(false)">
              <img 
                v-show="temp" 
                src="../../../lib/base/dishwasher/assets/shiwu@2x.png">
              <img 
                v-show="!temp" 
                src="../../../lib/base/dishwasher/assets/shiwu2@2x.png">
              <span >食材</span>
            </li>
          </ul>
          <!-- 左右滑动选择 -->
          <!-- 餐具 -->
          <div 
            v-if="temp" 
            class="swiper-container">
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
            class="swiper-container1">
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
        v-show="deviceAttrs.remain_washtime>'0'" 
        class="working">
        <div class="time">{{ deviceAttrs.remain_washtime | work_time }}</div>
        <div 
          v-show="deviceAttrs.control=='stop'" 
          class="progress">洗涤 —— 漂洗 —— 烘干</div>
        <div class="status">{{ deviceAttrs.control=='stop'?'已暂停':'洗涤中' }}</div>
      </div>
      <!-- 底部按钮 -->
      <div 
        v-if="deviceAttrs.switch=='on'" 
        class="panel-btn center">
        <div 
          v-show="deviceAttrs.control=='stop'&&deviceAttrs.remain_washtime=='0'" 
          class="btn-wrap">
          <div 
            :class="[{'active':deviceAttrs.control == 'start'},'btn-start btn center']"
            @click="setStart" />
          <div class="btn-name">启动</div>
        </div>
        <!-- 洗涤页面按钮 -->
        <div 
          v-show="deviceAttrs.control=='stop'&&deviceAttrs.remain_washtime>'0'" 
          class="btn-wrap">
          <div 
            ref="black"
            :class="[{'active':timeOutEvent > '0'},'btn-over btn center']"
            @touchstart="touchStart($event)"
            @touchmove="touchMove($event)"
            @touchend="touchEnd($event)"/>
          <div class="btn-name">长按结束</div>
        </div>
        <div 
          v-show="deviceAttrs.remain_washtime>'0'" 
          class="btn-wrap">
          <div 
            :class="[{'active':deviceAttrs.control == 'start'},'btn-start btn center']"
            @click="setStart" />
          <div class="btn-name">{{ deviceAttrs.control=='start'?'暂停':'继续' }}</div>
        </div>
      </div>
      <!-- 关机状态 -->
      <div 
        v-else
        class="panel-btn center">
        <div class="btn-wrap">
          <div 
            class="btn-swich btn"
            @click="setSwitch(on)" />
          <div class="btn-name">开机</div>
        </div>
      </div>

      <!-- <div 
        v-else
        class="btn-wrap">
        <div 
          class="btn-swich"
          @click="setStart" />
        <div class="btn-name">开机</div>
      </div> -->
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
      tableware:[
        {
          name:'除味',
          time:120,
        },
        {
          name:'密胺',
          time:120,
        },
        {
          name:'玻璃',
          time:120,
        },
        {
          name:'冲洗',
          time:120,
        },
        {
          name:'智能',
          time:120,
        }
        ,
        {
          name:'标准',
          time:120,
        }
        ,
        {
          name:'强力',
          time:120,
        }
        ,
        {
          name:'即时',
          time:120,
        }
        ,
        {
          name:'节能',
          time:120,
        }
        ,
        {
          name:'蒸汽',
          time:120,
        }
      ],
      foodList:[
        {
          name:'水果',
          time:120,
        },
        {
          name:'浆果',
          time:120,
        },
        {
          name:'核果',
          time:120,
        },
        {
          name:'仁果',
          time:120,
        },
        {
          name:'瓜果',
          time:120,
        }
        ,
        {
          name:'蔬果',
          time:120,
        }
        ,
        {
          name:'叶菜',
          time:120,
        }
        ,
        {
          name:'根菜',
          time:120,
        }
        ,
        {
          name:'茎菜',
          time:120,
        }
        ,
        {
          name:'果实',
          time:120,
        },
        {
          name:'食用菌',
          time:120,
        }
        ,
        {
          name:'海鲜',
          time:120,
        }
        ,
        {
          name:'甲壳',
          time:120,
        }
        ,
        {
          name:'贝类',
          time:120,
        }
        ,
        {
          name:'螺类',
          time:120,
        }
      ]
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
        //  this.newRatio()
      })
    }
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
          slidesPerView: 4,
        })
      },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 开关机
    shutdowncallback(val){
      this.controlDevice('switch',val)
    },
    // tab切换
    tabMode(t){
      this.temp = t
    },
    // 启动
    setStart() {
      if (this.deviceAttrs.remain_washtime>0) {
        
      }
      let controlStatus = ''
      if (this.deviceAttrs.control == 'start') {
        controlStatus = 'stop'
      } else {
        controlStatus = 'start'
      }
      this.controlDevice("control", controlStatus)
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
        .swiper-container {
          width: auto;
          margin-left: 960px;
          height: 300px;
        }
        .swiper-container1 {
          width: auto;
          margin-left: 2000px;
          height: 300px;
        }
        .swiper-wrapper{
          margin-left: 160px;
          .swiper-slide{
            width: 192px !important;
            position:relative;
            padding: 0 40px;
            &.swiper-slide-active{
              width: 275px !important;
              margin-right: 40px;
              margin-left: 40px;
              padding: 0;
              >div{
                opacity: 1;
                width: 275px;
                position:absolute;
                bottom: 0;
                >span{
                  &:first-of-type{
                    font-size: 160px;
                    position: relative;
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
    }
    .status{
      width: 100%;
      font-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
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
    position: relative;
      &.press{
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
      font-size: 24px;
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
      .panel-btn {
        // background: #fff;
      }
    }
    .panel-btn {
      // background: #efefef;
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

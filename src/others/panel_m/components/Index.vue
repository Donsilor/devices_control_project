<template>
  <div class="body">
    <div
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']"
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        page-class=".page"
      />
      <StatusTip/>
      <div class="main">
        <h3>按键配置</h3>
        <div class="collocation">
          <div
            v-for="(item,index) in collocationList"
            :key="index"
            :class="['collocation-item', {'colour': item.value}]">
            <span v-if="item.value">{{ item.name }}</span>
            <div
              v-else
              @click="fn2">
              <span class="add">+</span>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="item.value"
              @click="fn1(item.value)" >解除配置</p>
          </div>
        </div>
      </div>
      <!-- 配置页 -->
      <allocation
        v-show="newPageShow"
        @goBack="goBack"/>
      <!--弹框-->
      <model
        ref="model"
        @setMode="setMode" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import allocation from './Allocation.vue'
import model from './model.vue'
export default {
  components:{
    allocation,
    model
  },
  data() {
    return {
      checkboxVal: true,
      collocationList:[
        {
          value: 'a',
          name: "开灯"
        },
        {
          value: '',
          name: "关灯"
        },
        {
          value: '',
          name: "打开全部"
        },
        {
          value: 'd',
          name: "关闭全部"
        },
      ],
      newPageShow: false,
      num: ''
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    "device.stateChange"(){
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
        .then(() => {
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    fn1(val){
      console.log(val, '点击了')
      this.num = val
      this.$refs.model.show = true
    },
    setMode() {
      console.log(this.num, '确定了')
      this.$refs.model.show = false
    },
    fn2(){
      // this.newPageShow = true
      this.$router.push('./Allocation')
    },
    goBack(){
      this.newPageShow = false

    },
    // 滚动事件
    controlDevice(attr, value) {
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
  },
}
</script>
<style lang="less" scoped>
@imgPath:"base/konka_tv/assets";
  .page {
    // height: 100vh;
  &::before{
    content: "";
    // background-image: url('~@lib/@{imgPath}/img_bg.png');
    // background-repeat:no-repeat;
    // background-size: 100% 100%;
    background: #000;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  &::-webkit-scrollbar {
		display: none;
	}
  .main{
    padding: 214px 40px 0;
    h3{
      font-family: PingFangSC-Regular;
      font-size: 32px;
      color: #fff;
      height: 44px;
      line-height: 44px;
      margin-bottom: 24px;
    }
    .collocation{
      display: flex;
     justify-content: space-between;
      height: 464px;
      .collocation-item{
        position: relative;
        border-radius: 1.48px;
        flex: 1;
        margin-right: 12px;
        background: rgba(255,255,255,0.15);
        border-radius: 10px;
        padding-top: 164px;
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #000000;
        text-align: center;
        &.colour {
          background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
        }
        &:nth-child(4){
        margin-right: 0;
        }
        span{
          display: block;
          height: 114px;
          line-height: 34px;
          padding: 40px 0;
          color: #fff;
        }
        p{
          position: absolute;
          left: 50%;
          width: 120px;
          transform: translateX(-50%);
          bottom: 0;
          height: 81px;
          line-height: 81px;
          border-top:1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .add {
          background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 80px;
        }
        .dispose {
          background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 12px;
        }
      }
    }
  }
}



</style>

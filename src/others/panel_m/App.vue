<template>
  <div class="body">
    <div 
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']" 
    >
      <NewTopBar
        :title="device.device_name"
        :room="device.room_name"
        :scroll="true"
        bak-color="#000"
        page-class=".page"
      />
      <StatusTip/>
      <div class="main">
        <h3>按键配置</h3>
        <div class="collocation">
          <div 
            v-for="(item,index) in collocationList" 
            :key="index"  
            class="collocation-item">
            <span 
              v-if="item.value" 
              @click="fn1">{{ item.name }}</span>
            <div 
              v-else 
              @click="fn2">
              <span>+</span>
              <div>配置</div>
            </div>
            <p v-if="item.value" >解除绑定</p>
          </div>
        </div>
      </div>
      <allocation 
        v-show="newPageShow" 
        @goBack="goBack"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import allocation from './allocation.vue'
export default {
  components:{
    allocation
  },
  data() {
    return {
      checkboxVal: true,
      collocationList:[
        {
          value:'a',
          name:"开灯"
        },
        {
          value:'b',
          name:"关灯"
        },
        {
          value:'c',
          name:"打开全部"
        },
        {
          value:'',
          name:"关闭全部"
        },
      ],
      newPageShow:false
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
    fn1(){
      console.log('点击了')
      
    },
    fn2(){
      this.newPageShow = true
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
    height: 100vh;
  &::before{
    content: "";
    background-image: url('~@lib/@{imgPath}/img_bg.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
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
      color: #000000;
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
        background: #fff;
        padding-top: 164px;
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #000000;
        text-align: center;
        &:nth-child(4){
        margin-right: 0;

        }
        span{
          display: block;
          height: 114px;
          line-height: 34px;
          padding: 40px 0;
        }
        p{
          position: absolute;
          left: 50%;
          width: 120px;
          transform: translateX(-50%);
          bottom: 0;
          height: 81px;
          line-height: 81px;
          border-top:1px solid rgba(0,0,0,.1);
        }
      }
    }
  }
}



</style>
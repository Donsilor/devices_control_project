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
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>
      <div class="main">
        <h3>按键配置</h3>
        <div class="collocation">
          <div
            :class="['collocation-item', {'colour': dataList[0].board_key == 1}]">
            <span v-if="dataList[0].board_key == 1">{{ dataList[0].scene_name }}</span>
            <div
              v-else
              @click="setScene(1)">
              <span class="add">+</span>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="dataList[0].board_key == 1"
              @click="deleteScene(1)" >解除配置</p>
          </div>
          <div
            :class="['collocation-item', {'colour': dataList[1].board_key == 2}]">
            <span v-if="dataList[1].board_key == 2">{{ dataList[1].scene_name }}</span>
            <div
              v-else
              @click="setScene(2)">
              <span class="add">+</span>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="dataList[1].board_key == 2"
              @click="deleteScene(2)" >解除配置</p>
          </div>
          <div
            :class="['collocation-item', {'colour': dataList[2].board_key == 3}]">
            <span v-if="dataList[2].board_key == 3">{{ dataList[2].scene_name }}</span>
            <div
              v-else
              @click="setScene(3)">
              <span class="add">+</span>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="dataList[2].board_key == 3"
              @click="deleteScene(3)" >解除配置</p>
          </div>
          <div
            :class="['collocation-item', {'colour': dataList[3].board_key == 4}]">
            <span v-if="dataList[3].board_key == 4">{{ dataList[3].scene_name }}</span>
            <div
              v-else
              @click="setScene(4)">
              <span class="add">+</span>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="dataList[3].board_key == 4"
              @click="deleteScene(4)" >解除配置</p>
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
      num: '',
      list: [
        // {
        //   "scene_id": 11,
        //   "scene_name": "离家",
        //   "control_state":1,
        //   "enable":0,
        //   "icon":"fgdfg",
        //   "list_pic":{"normal":"objectId1"},
        //   "detail_pic":"sfdas",
        //   "board_key":11
        // },
        // {
        //   "scene_id": 11,
        //   "scene_name": "你好",
        //   "control_state":1,
        //   "enable":0,
        //   "icon":"fgdfg",
        //   "list_pic":{"normal":"objectId1"},
        //   "detail_pic":"sfdas",
        //   "board_key":1
        // },
        // {
        //   "scene_id": 11,
        //   "scene_name": "睡觉",
        //   "control_state":1,
        //   "enable":0,
        //   "icon":"fgdfg",
        //   "list_pic":{"normal":"objectId1"},
        //   "detail_pic":"sfdas",
        //   "board_key":3
        // },
        // {
        //   "scene_id": 11,
        //   "scene_name": "起床",
        //   "control_state":1,
        //   "enable":0,
        //   "icon":"fgdfg",
        //   "list_pic":{"normal":"objectId1"},
        //   "detail_pic":"sfdas",
        //   "board_key":2
        // },
        // {
        //   "scene_id": 12, // 场景id
        //   "scene_name": "回家", //场景名
        //   "control_state":1, //控制状态
        //   "enable":0, //打开状态
        //   "icon":"fgdfg",
        //   "list_pic":{"normal":"objectId1"}, //列表图标url,目前只有normal字段。后期扩展需要高亮和暗的图标，则加上对应字段。{"normal":"objectId1"，"bright":"sss","dark":"sdfd"}
        //   "detail_pic":"sfdas", //详情图标url
        //   "board_key":40
        // }
      ],
      dataList: [
        {},{},{},{}
      ]
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
      this.getScene()
      // this.list.map((x) =>{
      //   if(x.board_key == 1) {
      //     this.dataList[0] = x
      //   }
      //   if(x.board_key == 2) {
      //     this.dataList[1] = x
      //   }
      //   if(x.board_key == 3) {
      //     this.dataList[2] = x
      //   }
      //   if(x.board_key == 4) {
      //     this.dataList[3] = x
      //   }
      //   return this.dataList
      // })
      this.getDeviceInfo()
        .then(() => {
        })
      HdSmart.UI.setStatusBarColor(2)
    })
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'doControlDevice']),
    // 路由跳转
      OfflineHelpPage(){
        this.$router.push({
        path:"/SupconOfflineHelpPage"
      })
    },
    getScene() {
      return new Promise((resolve, reject) => {
           HdSmart.Device.control({}, (data) => {
            console.log('========data==========',data)
            if(data.result.list) {
              data.result.list.map((x) =>{
                if(x.board_key == 1) {
                  this.dataList[0] = x
                }
                if(x.board_key == 2) {
                  this.dataList[1] = x
                }
                if(x.board_key == 3) {
                  this.dataList[2] = x
                }
                if(x.board_key == 4) {
                  this.dataList[3] = x
                }
                return this.dataList
              })
            }
            resolve()
          },(err)=>{
            reject(err)
          },'dm_get_scene')
      })
    },
    deleteScene(i){
      this.scene_id = i
      this.$refs.model.show = true
    },
    setMode() {
      this.$refs.model.show = false
      this.delScene()
      .then(() =>{
        this.getScene()
      })
    },
    delScene() {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({
          "scene_id": this.scene_id,
          "board_key": -1
        }, () => {
          resolve()
        },(err)=>{
          reject(err)
        },'dm_set_scene_config')
      })
    },
    setScene(i){
      // this.newPageShow = true
      this.$router.push({
        name: 'Allocation',
        params: { data: i }
      })
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
          background-clip: text;
          color: transparent;
          font-size: 80px;
        }
        .dispose {
          background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 12px;
        }
      }
    }
  }
}



</style>

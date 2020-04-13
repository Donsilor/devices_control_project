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

      <!-- 新需求待定 -->
      <!-- <div
        class="list headerMargin"
        @click="showMode">
        <div class="left">名称</div>
        <div class="right after">面板</div>
      </div> -->

      <div class="main">
        <h3>按键配置</h3>
        <div class="collocation">
          <div
            :class="['collocation-item', {'colour': dataList[0].board_key == 135}]"
            @click="dataList[0].board_key == 135 ? '' : setScene(135)">
            <div
              v-if="dataList[0].board_key == 135"
              class="txt">{{ dataList[0].scene_name }}</div>
            <div
              v-else
              class="set">
              <div class="add">+</div>
              <div class="dispose">配置</div>
            </div>
            <div
              v-if="dataList[0].board_key == 135"
              class="delBtn"
              @click="deleteScene(dataList[0].scene_id)">解除配置</div>
          </div>
          <div
            :class="['collocation-item', {'colour': dataList[1].board_key == 136}]"
            @click="dataList[1].board_key == 136 ? '' : setScene(136)">
            <div
              v-if="dataList[1].board_key == 136"
              class="txt">{{ dataList[1].scene_name }}</div>
            <div
              v-else
              class="set">
              <div class="add">+</div>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="dataList[1].board_key == 136"
              class="delBtn"
              @click="deleteScene(dataList[1].scene_id)" >解除配置</p>
          </div>
          <div
            :class="['collocation-item', {'colour': dataList[2].board_key == 137}]"
            @click="dataList[2].board_key == 137 ? '' : setScene(137)">
            <div
              v-if="dataList[2].board_key == 137"
              class="txt">{{ dataList[2].scene_name }}</div>
            <div
              v-else
              class="set">
              <div class="add">+</div>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="dataList[2].board_key == 137"
              class="delBtn"
              @click="deleteScene(dataList[2].scene_id)" >解除配置</p>
          </div>
          <div
            :class="['collocation-item', {'colour': dataList[3].board_key == 138}]"
            @click="dataList[3].board_key == 138 ? '' : setScene(138)">
            <div
              v-if="dataList[3].board_key == 138"
              class="txt">{{ dataList[3].scene_name }}</div>
            <div
              v-else
              class="set">
              <div class="add">+</div>
              <div class="dispose">配置</div>
            </div>
            <p
              v-if="dataList[3].board_key == 138"
              class="delBtn"
              @click="deleteScene(dataList[3].scene_id)" >解除配置</p>
          </div>
        </div>
      </div>

      <!-- 新需求待定 -->
      <!-- <div class="list centerMargin">
        <div class="left">固件版本</div>
        <div class="right">1.0.2</div>
      </div>
      <div class="list noneBorder">
        <div class="left">设备工作模式</div>
        <div class="right">WIFI模式</div>
      </div>
      <div class="list noneBorder">
        <div class="left">品牌</div>
        <div class="right">星络</div>
      </div>
      <div class="list noneBorder">
        <div class="left">型号</div>
        <div class="right">PAK417310</div>
      </div>
      <div class="list noneBorder">
        <div class="left">设备识别号</div>
        <div class="right">D0:BA:E3:70:00:A8</div>
      </div>
      <div class="list footer">
        <div class="left">添加时间</div>
        <div class="right">2019-04-17 20:37</div>
      </div> -->

      <!-- 配置页 -->
      <allocation
        v-show="newPageShow"
        @goBack="goBack"/>
      <!--弹框-->
      <model
        ref="model"
        @setMode="setMode" />
      <!--弹框-->
      <model-swing
        ref="swing"
        @setWind="setWind" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import allocation from './Allocation.vue'
import model from './model.vue'
import modelSwing from './model-swing'
export default {
  components:{
    allocation,
    model,
    modelSwing
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
        {
          "scene_id": 11,
          "scene_name": "离家",
          "control_state":1,
          "enable":0,
          "icon":"fgdfg",
          "list_pic":{"normal":"objectId1"},
          "detail_pic":"sfdas",
          "board_key":135
        },
        {
          "scene_id": 11,
          "scene_name": "你好",
          "control_state":1,
          "enable":0,
          "icon":"fgdfg",
          "list_pic":{"normal":"objectId1"},
          "detail_pic":"sfdas",
          "board_key":12
        },
        {
          "scene_id": 11,
          "scene_name": "睡觉",
          "control_state":1,
          "enable":0,
          "icon":"fgdfg",
          "list_pic":{"normal":"objectId1"},
          "detail_pic":"sfdas",
          "board_key":3
        },
        {
          "scene_id": 11,
          "scene_name": "起床",
          "control_state":1,
          "enable":0,
          "icon":"fgdfg",
          "list_pic":{"normal":"objectId1"},
          "detail_pic":"sfdas",
          "board_key":2
        },
        {
          "scene_id": 12, // 场景id
          "scene_name": "回家", //场景名
          "control_state":1, //控制状态
          "enable":0, //打开状态
          "icon":"fgdfg",
          "list_pic":{"normal":"objectId1"}, //列表图标url,目前只有normal字段。后期扩展需要高亮和暗的图标，则加上对应字段。{"normal":"objectId1"，"bright":"sss","dark":"sdfd"}
          "detail_pic":"sfdas", //详情图标url
          "board_key":4
        }
      ],
      dataList: [
        {},{},{},{}
      ],
      jsonList: {}
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
    console.log('created=====第一步')
    HdSmart.ready(() => {
      console.log('HdSmart.ready=====第二步')
      this.getDeviceInfo()
        .then(() => {
          console.log('getDeviceInfo回调=====第三步')
          //接口请求
          let that = this
          this.getScene()
          .then((data) => {
            console.log('========Index-data==========',data)
            if (typeof data.result === 'string') {
              that.jsonList = JSON.parse(data.result)
            } else if (typeof data.result === 'object') {
              that.jsonList = data.result
            }
            if(that.jsonList.list) {
              that.jsonList.list.map((x) =>{
                if(x.board_key == 135 && x.enable == 1) {
                  // that.dataList.splice(0, 1, x)
                  that.$set(that.dataList, 0, x)
                }
                if(x.board_key == 136 && x.enable == 1) {
                  // that.dataList.splice(1, 1, x)
                  that.$set(that.dataList, 1, x)
                }
                if(x.board_key == 137 && x.enable == 1) {
                  // that.dataList.splice(2, 1, x)
                  that.$set(that.dataList, 2, x)
                }
                if(x.board_key == 138 && x.enable == 1) {
                  // that.dataList.splice(3, 1, x)
                  that.$set(that.dataList, 3, x)
                }
                return that.dataList
              })
            }
          })
          //本地调试
          // setTimeout(() => {
          //   this.list.map((x) =>{
          //     if(x.board_key == 135) {
          //         this.dataList.splice(0, 1, x)
          //       }
          //       if(x.board_key == 136) {
          //         this.dataList.splice(1, 1, x)
          //       }
          //       if(x.board_key == 137) {
          //         this.dataList.splice(2, 1, x)
          //       }
          //       if(x.board_key == 138) {
          //         this.dataList.splice(3, 1, x)
          //       }
          //     return this.dataList
          //   })
          // }, 500)
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
      this.$forceUpdate()
      return new Promise((resolve, reject) => {
           HdSmart.Device.control({}, (data) => {
            resolve(data)
          },(err)=>{
            reject(err)
          },'dm_get_scene')
      })
    },
    deleteScene(i){
      if(window.house_holder_status == 0) return HdSmart.UI.toast('只有户主有解绑权限')
      this.scene_id = i
      this.$refs.model.show = true
    },
    setMode() {
      let that = this
      that.$refs.model.show = false
      that.jsonList = JSON.parse(JSON.stringify(that.jsonList))
      that.dataList = JSON.parse(JSON.stringify(that.dataList))
      that.delScene()
      .then(() =>{
        that.dataList = [{}, {}, {}, {}]
        that.getScene()
        .then((data) => {
          console.log('========解除配置-data==========',data)
          if (typeof data.result === 'string') {
            that.jsonList = JSON.parse(data.result)
          } else if (typeof data.result === 'object') {
            that.jsonList = data.result
          }
          if(that.jsonList.list) {
            that.jsonList.list.map((x) =>{
              if(x.board_key == 135 && x.enable == 1) {
                // that.dataList.splice(0, 1, x)
                that.$set(that.dataList, 0, x)
              }
              if(x.board_key == 136 && x.enable == 1) {
                // that.dataList.splice(1, 1, x)
                that.$set(that.dataList, 1, x)
              }
              if(x.board_key == 137 && x.enable == 1) {
                // that.dataList.splice(2, 1, x)
                that.$set(that.dataList, 2, x)
              }
              if(x.board_key == 138 && x.enable == 1) {
                // that.dataList.splice(3, 1, x)
                that.$set(that.dataList, 3, x)
              }
              return that.dataList
            })
          }
        })
      })
    },
    delScene() {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({
          "list":[
            {
            "scene_id": this.scene_id,
            "board_key": -1
            }
          ]
        }, () => {
          resolve()
        },(err)=>{
          reject(err)
        },'dm_set_scene_config')
      })
    },
    setScene(i) {
      if(window.house_holder_status == 0) return HdSmart.UI.toast('只有户主有配置权限')
      // this.newPageShow = true
      this.$router.push({
        name: 'Allocation',
        params: { data: i }
      })
    },
    goBack(){
      this.newPageShow = false
    },
    showMode() {
      this.$refs.swing.show = true
    },
    setWind() {

    },
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
    // 新需求待定
    // padding: 30px 24px 48px;
    // border-top: 0.5px solid rgba(255,255,255,0.20);
    // border-bottom: 0.5px solid rgba(255,255,255,0.20);
    // background: rgba(255,255,255,0.08);
    h3{
      font-family: PingFangSC-Regular;
      font-size: 32px;
      color: #fff;
      height: 44px;
      line-height: 44px;
      margin-bottom: 30px;
    }
    .collocation{
      display: flex;
      justify-content: space-between;
      height: 466px;
      // 新需求待定
      // height: 360px;
      .collocation-item{
        position: relative;
        flex: 1;
        margin-right: 12px;
        background: rgba(255,255,255,0.15);
        border-radius: 10px;
        // padding-top: 164px;
        font-size: 12px;
        color: #000000;
        text-align: center;
        height: 466px;
      // 新需求待定
        // height: 360px;
        // border-radius: 6px;
        // border: 0.5px solid rgba(255,255,255,0.20);
        &.colour {
          background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
        }
        &:nth-child(4){
        margin-right: 0;
        }
        .txt{
          // height: 114px;
          height: 384px;;
          line-height: 466px;
          // padding: 40px 0;
          color: #fff;
          vertical-align: middle;
          font-size: 24px;
        }
        .delBtn{
          // width: 100%;
          width: 120px;
          display: inline-block;
          position: relative;
          text-align: center;
          vertical-align: middle;
          bottom: 0;
          height: 81px;
          line-height: 81px;
          border-top:1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 24px;
        }
        .set {
          position: relative;
          color: #fff;
          vertical-align: middle;
          top: 50%;
          transform: translateY(-50%);
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
            font-size: 24px;
            line-height: 48px;
          }
        }

      }
    }
  }
  .list {
    background: rgba(255,255,255,0.08);
    height: 104px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0 0 0 0 rgba(255,255,255,0.10), inset 0 0 0 0 rgba(255,255,255,0.10);
    border-top: 0.5px solid rgba(255,255,255,0.20);
    border-bottom: 0.5px solid rgba(255,255,255,0.20);
    .left {
      font-size: 32px;
      color: #FFFFFF;
    }
    .right {
      opacity: 0.5;
      font-family: PingFangSC-Light;
      font-size: 32px;
      color: #FFFFFF;
      &.after {
        &::after {
          content: "";
          margin-left: 20px;;
          display: inline-block;
          border-top: 1px solid;
          border-right: 1px solid;
          width: 10px;
          height: 10px;
          transform: rotate(45deg);
          position: relative;
          top: -1px;
          right: 2px;
        }
      }
    }
  }
  .headerMargin {
    margin: 20px 0 48px;
  }
  .centerMargin {
    margin: 48px 0 80px;
  }
  .noneBorder {
    border-bottom: none;
  }
  .footer {
    margin-bottom: 12px;
  }
}
</style>

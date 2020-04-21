<template>
  <div class="body">
    <div
      :class="[{ 'offline': isOffline }, {'close': isClose}, 'page']"
    >
      <div
        ref="topbar"
        class="topbar">
        <div
          :style="{ height:status_bar_height+navigation_bar_height+'px', 'line-height': status_bar_height+navigation_bar_height + 'px'}"
          class="topbar-block" />
        <div

          :class="['topbar-fixed']">

          <div
            ref="statusbar"
            :style="{height:status_bar_height+'px'}"
            class="statusbar" />
          <!-- <div
        ref="statusbarBg"
        :style="{height:status_bar_height+navigation_bar_height+'px'}"
        class="statusbarBg"/> -->
          <div
            ref="newNavbar"
            :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"
            class="newNavbar">
            <div
              class="left"
              @click.prevent="goBack">
              <p/>
            <!-- <a
            :style="{ 'border-color': bakColor }"
            href="javascript:void(0);"
            class="icon-return" /> -->
            </div>
            <div class="title">面板配置</div>
            <!-- <div
              class="right"
              @click.prevent="goDetail">
              <p/>
            </div> -->
          </div>
        </div>
      </div>
      <StatusTip @OfflineHelpPage="OfflineHelpPage"/>

      <!-- 新需求待定 -->
      <div
        class="list headerMarginTop"
        @click.prevent="showSwing">
        <div class="left">名称</div>
        <div class="right after">{{ name }}</div>
      </div>
      <div
        class="list headerMarginBottom"
        @click.prevent="goRoom">
        <div class="left">所属房间</div>
        <div class="right after">{{ room }}</div>
      </div>

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
      <div
        class="list centerMarginTop"
        @click.prevent="goInfo">
        <div class="left">设备信息</div>
        <div class="right after"/>
      </div>
      <div class="list centerMarginBottom">
        <div class="left">固件信息</div>
        <div class="right interval">1.0.2</div>
      </div>

      <div
        class="list noneBorder"
        @click.prevent="goHelp">
        <div class="left">使用帮助</div>
        <div class="right after"/>
      </div>
      <div class="list footer">
        <div class="left">客服电话</div>
        <div class="right interval">400 090 6666</div>
      </div>

      <div
        class="list flexCenter"
        @click.prevent="showUntying">
        <div class="listCenter">解绑</div>
      </div>
      <!--解除配置弹框-->
      <model
        ref="model"
        @setMode="setMode" />
      <!--修改名称弹框-->
      <model-swing
        ref="swing"
        @setWind="setWind" />
      <!--解绑弹框-->
      <untying
        ref="untying"
        :family="familyId"
        @setUntying="setUntying" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import model from './model.vue'
import untying from './untying'
import modelSwing from './model-swing'

let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

export default {
  components:{
    model,
    modelSwing,
    untying
  },
  data() {
    return {
      status_bar_height:25,
      navigation_bar_height:44,
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
          "board_key":136
        },
        {
          "scene_id": 11,
          "scene_name": "睡觉",
          "control_state":1,
          "enable":0,
          "icon":"fgdfg",
          "list_pic":{"normal":"objectId1"},
          "detail_pic":"sfdas",
          "board_key":137
        },
        {
          "scene_id": 11,
          "scene_name": "起床",
          "control_state":1,
          "enable":0,
          "icon":"fgdfg",
          "list_pic":{"normal":"objectId1"},
          "detail_pic":"sfdas",
          "board_key":138
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
      jsonList: {},
      updatedList: {},
      name: '',
      room: '',
      deviceId: '',
      deviceUuid: '',
      familyId: '',
    }
  },
  computed: {
    ...mapGetters(['isClose', 'isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  watch: {
    "device.stateChange"(){
      this.name = this.device.device_name
      this.room = this.device.room_name
      this.deviceId = this.device.device_id
      this.deviceUuid = this.device.device_uuid
      this.familyId = this.device.family_id
    },
    "device.device_name"(){
      this.name = this.device.device_name
    },
    "device.room_name"(){
      this.room = this.device.room_name
    },
    "device.device_id"(){
      this.deviceId = this.device.device_id
    },
    "device.device_uuid"(){
      this.deviceUuid = this.device.device_uuid
    },
    "device.family_id"(){
      this.familyId = this.device.family_id
    },
  },
  created() {
    HdSmart.ready(() => {
      this.getDeviceInfo()
      .then(() => {
        //接口请求
        this.getScene()
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
      if (window.status_bar_height) {
        this.status_bar_height = window.status_bar_height / dpr
      }
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
    // 获取所有场景
    getScene() {
      let that = this
      this.$forceUpdate()
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({}, (data) => {
          console.log('========解除配置-data==========',data)
          if (typeof data.result === 'string') {
            that.jsonList = JSON.parse(data.result)
          } else if (typeof data.result === 'object') {
            that.jsonList = data.result
          }
          if(that.jsonList.list) {
            that.jsonList.list.map((x) =>{
              if(x.board_key == 135 && x.enable == 1) {
                that.$set(that.dataList, 0, x)
              }
              if(x.board_key == 136 && x.enable == 1) {
                that.$set(that.dataList, 1, x)
              }
              if(x.board_key == 137 && x.enable == 1) {
                that.$set(that.dataList, 2, x)
              }
              if(x.board_key == 138 && x.enable == 1) {
                that.$set(that.dataList, 3, x)
              }
              return that.dataList
            })
          }
          resolve(data)
        },(err)=>{
          reject(err)
        },'dm_get_scene')
      })
    },
    // 解除配置弹框
    deleteScene(i){
      if(window.house_holder_status == 0) return HdSmart.UI.toast('只有家庭管理员可以执行此操作')
      this.scene_id = i
      this.$refs.model.show = true
    },
    // 解除配置
    setMode() {
      let that = this
      that.$refs.model.show = false
      that.jsonList = JSON.parse(JSON.stringify(that.jsonList))
      that.dataList = JSON.parse(JSON.stringify(that.dataList))
      that.delScene()
      .then(() =>{
        that.dataList = [{}, {}, {}, {}]
        that.getScene()
      })
    },
    // 解除配置接口
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
    // 跳转按键配置
    setScene(i) {
      if(window.house_holder_status == 0) return HdSmart.UI.toast('只有家庭管理员可以执行此操作')
      this.$router.push({
        name: 'Allocation',
        params: { data: i }
      })
    },
    // 关闭webview
    goBack(){
      HdSmart.UI.popWindow()
    },
    // 解绑面板弹框
    showUntying() {
      if(window.house_holder_status == 0) return HdSmart.UI.toast('只有家庭管理员可以执行此操作')
      this.$refs.untying.show = true
    },
    // 解绑面板弹框隐藏
    setUntying() {
      this.$refs.untying.show = false
    },
    // 修改面板名称弹框
    showSwing() {
      if(window.house_holder_status == 0) return HdSmart.UI.toast('只有家庭管理员可以执行此操作')
      this.$refs.swing.show = true
    },
    // 修改面板名称
    setWind(t) {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({
          "list":[
            {
            "device_id": this.deviceId,
            "device_uuid": this.deviceUuid,
            "device_name": t
            }
          ]
        }, (data) => {
          if (typeof data.result === 'string') {
            this.updatedList = JSON.parse(data.result)
          } else if (typeof data.result === 'object') {
            this.updatedList = data.result
          }
          this.$refs.swing.show = false
          this.name = this.updatedList.list[0].device_name
          resolve(data)
        },(err)=>{
          reject(err)
        },'dm_update_device')
      })
    },
    goDetail() {
      HdSmart.UI.goDeviceDetail()
    },
    // 跳转所属房间
    goRoom() {
      HdSmart.UI.goDeviceRoom()
    },
    // 跳转设备信息
    goInfo() {
      HdSmart.UI.goDeviceInfo()
    },
    // 跳转使用帮助
    goHelp() {
      HdSmart.UI.goDeviceHelp()
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
    padding: 30px 24px 48px;
    border-top: 0.5px solid rgba(255,255,255,0.20);
    border-bottom: 0.5px solid rgba(255,255,255,0.20);
    background: rgba(255,255,255,0.08);
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
      // 新需求待定
      height: 360px;
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
      // 新需求待定
        height: 360px;
        border-radius: 6px;
        border: 0.5px solid rgba(255,255,255,0.20);
        &.colour {
          background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
          border: none;
          &:nth-child(2){
            background-image: linear-gradient(225deg, #FF59DA 0%, #FD30AA 100%);
          }
          &:nth-child(3){
            background-image: linear-gradient(225deg, #1EB4F2 0%, #713DF4 100%);
          }
          &:nth-child(4){
            background-image: linear-gradient(225deg, #1DD3A6 0%, #347ADF 100%);
          }
        }
        &:nth-child(4){
        margin-right: 0;
        }
        .txt{
          height: 278px;;
          display: flex;
          align-items: center;
          justify-content: center;
          // line-height: 466px;
          color: #fff;
          vertical-align: middle;
          font-size: 24px;
        }
        .delBtn{
          // width: 100%;
          width: 120px;
          height: 81px;
          border-top:1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
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
    .listCenter {
      font-size: 32px;
      color: #FF0000;
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
      &.interval {
        &::after {
          content: "";
          margin-left: 21px;;
          display: inline-block;
          // border-top: 1px solid;
          // border-right: 1px solid;
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
  .headerMarginTop {
    margin-top: 20px;
  }
  .headerMarginBottom {
    border-top: none;
    margin-bottom: 48px;
  }
  .centerMarginTop {
    margin-top: 48px;
  }
  .centerMarginBottom {
    border-top: none;
    margin-bottom: 48px;
  }
  .noneBorder {
    border-bottom: none;
  }
  .footer {
    margin-bottom: 48px;
  }
  .flexCenter {
    justify-content: center
  }
}
/* topbar */
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
.topbar{
  position: relative;
  z-index: 9999;
  .icon-search{
    &::before{
      font-size: 20PX;
      position: relative;
      bottom: 14px;
    }
}
  .topbar-block {
    height: @status_bar_height+@navigation_bar_height;
  }
  .topbar-fixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.8);
  }
}





.topbar-nobg {
  .topbar-fixed {
    background: transparent;
    border-bottom: none;
  }
  .navbar {
    color: #fff;
    .left a,
    .right a {
      color: #fff;
    }
  }
}

.topbar-black {
  .topbar-fixed {
    // background: #20282b;
    background: #35353d;
    border-bottom: none;
  }
  .navbar {
    color: #fff;
    .left a,
    .right a {
      color: #fff;
    }
  }
}

.statusbar {
  height: @status_bar_height;
}


.newNavbar {
  display: flex;
  padding: 0 24px;
  justify-content: space-between;
  height: @navigation_bar_height;
  position: relative;
  color: #222a37;
  align-items: center;
  .left,
  .right,.right-search {
    // width: 44PX;
    // height: @navigation_bar_height;
   width: 60px;
    height: 60px;
    p{
        width: 40px;
        height: 40px;

    }

  }
  .left{
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    position: absolute;
    // left: 40px;
    // background: rgba(255,255,255,0.05);
    p{
        background: url('~@lib/base/img/arrow_back.png');
        background-size: 100% 100%;

    }
  }
  .right{
      // display: flex;
      // justify-content: center;
      // align-items: center;
      position: absolute;
      right: 40px;
    p{
      background: url('~@lib/base/img/kt_btn_setting.png');
        background-size: 100% 100%;

    }

  }



  .left a,
  .right a {
    width: @navigation_bar_height;
    height: @navigation_bar_height;
    display: block;
    line-height: @navigation_bar_height;
    color: #222a37;
    text-align: center;
    font-size: 17PX;
    text-decoration: none;
    &:active {
      opacity: 0.8;
    }
  }

}
.title {
  text-align: center;
  font-size: 17PX;
  width: 100%;
  color: #fff;
}
</style>

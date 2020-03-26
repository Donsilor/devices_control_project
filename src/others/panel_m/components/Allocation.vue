<template>
  <div
    ref="page"
    class="Allocation">
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
          <div class="title">按键配置</div>
          <div
            class="right"
            @click.prevent="goDetail">
            <p/>
          </div>
        </div>
      </div>
    </div>
    <div class="viewHelpstatus">
      <div class="Prefabrication">
        <h3 class="AllocationH3">APP场景</h3>
        <ul class="PrefabricationUl">
          <li
            v-for="(item, i) in list"
            :key="i"
            @click="settingScene(item.scene_id)">
            <p>{{ item.scene_name }}</p>
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

export default {
  data(){
    return{
      status_bar_height:25,
      navigation_bar_height:44,
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
    }
  },
    computed:{
    ...mapGetters(['isClose', 'isOffline','networkStatus','viewHelpstatus']),
    ...mapState(['device', 'deviceAttrs']),

  },
   created() {
    HdSmart.ready(() => {
      this.getScene()
      if (window.status_bar_height) {
        this.status_bar_height = window.status_bar_height / dpr
      }
    })
  },
  methods:{
    ...mapActions(['getDeviceInfo','getNetworkInfo','setNetworkStatus','doControlDevice','getViewHelpInfo','setViewHelpInfo']),
    getScene() {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({}, (data) => {
          console.log('========data==========',data)
          this.list = data.result.list
          resolve()
        },(err)=>{
          reject(err)
        },'dm_get_scene')
      })
    },
    settingScene(item) {
      this.setScene(item)
      .then(() =>{
        this.goBack()
      })
    },
    setScene(item) {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({
          "list":[
            {
            "scene_id": item,
            "board_key": this.$route.params.data
            }
          ]
        }, () => {
          resolve()
        },(err)=>{
          console.log(err)
          reject(err)
        },'dm_set_scene_config')
      })
    },
    goBack(){
      this.$router.go(-1)
    },
    goDetail() {
      HdSmart.UI.goDeviceDetail()
    },
  }
}
</script>

<style scoped lang="less">
.Allocation {
  // width: 100%;
  // height: 100vh;
  &::before{
    content: "";
    // width: 100%;
    // background: url('~@lib/base/img/bg02.png') no-repeat;
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

*{ -webkit-tap-highlight-color:transparent; }

/* topbar */
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
.no-work{
  opacity: 0.3;
  position: relative;
}
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
  padding: 0 40px;
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
    left: 40px;
    p{
        background: url('~@lib/base/img/kt_btn_close.png');
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
.Allocationstatus{
  font-size: 28px;
  padding: 0 40px;
  line-height: 1.5em;

  // font-weight: lighter;
  color: rgba(0, 0, 0, .5);

}

  .AllocationH3{
  padding: 12px 40px 24px;
  font-size: 32px;
  font-family: PingFangSC-Regular;
  color: #fff;
// margin-bottom:12px;

  }
  .PrefabricationUl{
    padding: 0 40px 28px;
    font-size: 32px;
    li{
      line-height: 156px;
      height: 156px;
      background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
      margin-bottom: 12px;
      padding-left: 40px;
      border-radius: 10px;
      p{
          font-family: PingFangSC-Regular;
          color: #fff;
        &:nth-child(1){
          font-size: 32px;
          // padding: 40px 0 12px 0;
        }
        &:nth-child(2){
          font-size: 24px;
        }
      }
      &:nth-child(1){
        background-image: linear-gradient(225deg, #1DD3A6 0%, #347ADF 100%);
      }
      &:nth-child(2){
        background-image: linear-gradient(225deg, #FF59DA 0%, #FD30AA 100%);
      }
      &:nth-child(3){
        background-image: linear-gradient(225deg, #1EB4F2 0%, #713DF4 100%);
      }
      // &:nth-child(4){
      //   background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
      // }
    }
  }
}
</style>

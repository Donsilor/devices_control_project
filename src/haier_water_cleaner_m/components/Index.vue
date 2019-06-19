<template>
  <div :class="[ bgClass,'page']">
    <div class="bg">
      <topbar 
        :transparent="true"
        :title="device_name" />
      <div class="main">
        <div class="title">过滤前水质：{{ oldTDS }} TDS</div>
        <div 
          class="wrap-num"
          @click="tdsModalVisibleControl">
          <span class="num">
            {{ nowTDS }}
            <span class="unit">TDS</span>
          </span>
        </div>
        <div class="msg">{{ rankTxt }}</div>
      </div>
    </div>

    <div class="wrap-wave">
      <div class="wave-bg">
        <div class="wave">{{ statusTip }}</div>
      </div>
    </div>

    <div class="wrap-filter">
      <div class="filter">
        <div class="filter-item">{{ model.filter_lifetime[0] }}<sup>%</sup></div>
        <div class="filter-name">剩余初滤滤芯</div>
      </div>
      <div class="filter">
        <div class="filter-item">{{ model.filter_lifetime[1] }}<sup>%</sup></div>
        <div class="filter-name">剩余吸附滤芯</div>
      </div>
      <div class="filter">
        <div class="filter-item">{{ model.filter_lifetime[2] }}<sup>%</sup></div>
        <div class="filter-name">剩余RO滤芯</div>
      </div>
    </div>
    <div class="panel-btn">
      <div class="btn-wrap btns">
        <div 
          :class="[model.status == 'clean' ? 'clean' : '', 'btn btn-hh center circleProgress_wrapper']"
          @click="setClean">
          <div class="wrapper right">
            <div class="circleProgress rightcircle" />
          </div>
          <div class="wrapper left">
            <div class="circleProgress leftcircle" />
          </div>
        </div>
        <div class="btn-name">冲洗</div>
      </div>
    </div>

    <sub-page 
      v-model="tdsModalVisible"
      title="TDS简介"
      class="modal-w">
      <div class="tds">
        <p>
          对日常自来水而言，TDS是较为常用且有效的水质指标，可以反映出净水器的实际效果， 数值越低代表过滤效果越好。但对于含有致病菌、悬浮物等有害物质的水源，TDS并不适用。
        </p>
        <p class="sub-title">
          TDS数值范围说明（PPM)
        </p>
        <div class="items">
          <div class="item item1">纯净水</div>
          <div class="item item2">净化水</div>
          <div class="item item3">自来水</div>
          <div class="item item3">自来水</div>
          <div class="item item4">污染水</div>
        </div>
        <ul class="ruler">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
        <ul class="name">
          <li>0</li>
          <li>50</li>
          <li>100</li>
          <li>200</li>
          <li>300+</li>
          <li />
        </ul>
      </div>
    </sub-page>
  </div>
</template>

<script>
// var res = {
//     "water_filter_result": {
//         "TDS": [500,100]
//     },
//     "status": "clean",
//     "filter_time_total": [1000, 1000, 1000, 1000, 1000],
//     "filter_time_remaining": [300, 500, 0, 600, 0],
//     "filter_lifetime": [30, 50, 0, 60, 0],
//     "filter_status": '',
//     "status": "clean"
// }


import SubPage from './SubPage.vue'
export default {
  components: {
    SubPage
  },
  data() {
    return {
      model: {
        "water_filter_result": {
          "TDS": [500, 100]
        },
        "status": "clean",
        "filter_time_total": [1000, 1000, 1000, 1000, 1000],
        "filter_time_remaining": [300, 500, 0, 600, 0],
        "filter_lifetime": [30, 50, 0, 60, 0],
        "filter_status": ''
      },
      device_name: '',
      tdsModalVisible: false,
    }
  },
  computed: {
    oldTDS() {
      return this.model.water_filter_result.TDS[0]
    },
    nowTDS() {
      return this.model.water_filter_result.TDS[1]
    },
    hasTDS() {
      return this.oldTDS != 65535
    },
    rank() {
      if (this.nowTDS < 50) {
        return 1
      } else if (this.nowTDS < 100) {
        return 2
      } else if (this.nowTDS < 300) {
        return 3
      } else if (this.nowTDS >= 300) {
        return 4
      }
    },
    rankTxt() {
      if (this.nowTDS < 50) {
        return '当前指数水质可以直饮'
      } else if (this.nowTDS < 300) {
        return '当前指数水质不建议直饮'
      } else if (this.nowTDS >= 300) {
        return '当前指数水质不能饮用'
      }
    },
    statusTip() {
      //净水器状态
      if (this.model.status == 'filter') {
        return '制水中...'
      }
      if (this.model.status == 'clean') {
        return '冲洗中...'
      }
      if (this.model.status == 'standby' && this.hasTDS && this.oldTDS) {
        return '过滤前水质：' + this.oldTDS + ' TDS'
      }
      if (this.model.status == 'standby') {
        return '待机'
      }
      return ''
    },
    bgClass() {
      /* eslint-disable no-unreachable */
      switch (this.rank) {
        case 1:
          return 'great'
          break
        case 2:
          return 'good'
          break
        case 3:
          return 'normal'
          break
        case 4:
          return 'bad'
          break
      }
    },
  },
  watch: {
  },
  created() {
  },
  mounted() {
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name
      }
      HdSmart.UI.showLoading()
      this.getSnapShot()
    })

    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result)
    })
    HdSmart.onDeviceAlert(data => {
      this.onDaAlertErr(data.result)//上报
    })
  },
  methods: {
    tdsModalVisibleControl() {
      //点击TDS按钮
      this.tdsModalVisible = !this.tdsModalVisible
    },
    getSnapShot() {
      HdSmart.Device.getSnapShot(
        data => {
          this.onSuccess(data)
          HdSmart.UI.hideLoading()
        },
        () => {
          this.success = false
          HdSmart.UI.hideLoading()
        }
      )
    },
    controlDevice(attr, val, success) {
      HdSmart.Device.control(
        {
          method: 'dm_set',
          nodeid: `water_filter.main.${attr}`,
          params: {
            attribute: {
              [attr]: val
            }
          }
        },
        () => {
          success && success()
        },
        () => { }
      )
    },
    onSuccess(result) {
      this.model = result.attribute
    },
    setClean() {
      console.log('setClean')
      //一键冲洗 如果正在冲洗中，只是改变下UI状态
      if (this.model.status != 'clean') {
        this.model.status = 'clean'

        this.controlDevice('control', 'clean', () => {
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.page {
  background: #fff;
  color: #fff;
  text-align: center;
  .bg {
    background: #fe3232;
  }
  .main {
    font-size: 24px;
    .title {
      margin-top: 126px;
      opacity: 0.5;
    }
    .wrap-num {
      margin-top: 40px;
      .num {
        position: relative;
        line-height: 1;
        font-size: 200px;
      }
      .unit {
        position: absolute;
        top: 56px;
        right: -40px;

        font-size: 24px;
      }
    }
    .msg {
      margin-top: 12px;
      padding-bottom: 131px;
    }
  }
  .wave-bg {
    background: #fe3232;
    border-radius: 0 0 750px 750px;
  }
  .wave {
    background-image: url(../../../lib/base/haier_water_cleaner/assets/wave.png);
    background-size: 165% 100%;

    width: 100%;
    padding: 221px 0 120px 0;
    font-size: 24px;

    border-radius: 0 0 750px 750px;
  }
  .wrap-filter {
    display: flex;
    justify-content: center;
  }
  .filter {
    color: #232323;
    margin: 60px 38px;
    .filter-item {
      position: relative;
      font-size: 80px;
      sup {
        font-size: 24px;
        position: absolute;
        top: 15px;
      }
    }
    .filter-name {
      color: #000;
      font-size: 24px;
    }
  }
  .panel-btn {
    height: 306px;
    // background: #35353d;
    // box-shadow: 0 -3px 28px 0 rgba(17, 17, 17, 0.5);
    // border-radius: 42px 42px 0px 0px;

    background: #FFFFFF;
    box-shadow: 0 -3px 28px 0 rgba(209,209,209,0.50);
    border-radius: 42px 42px 0px 0px;
  }

  .btns {
    padding-top: 50px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #000;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border: none;
      }
    }
    .btn-name {
      color: #000;
      margin-top: 14px;
      font-size: 24px;
    }
    .btn-hh {
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
        background-image: url(../../../lib/base/haier_water_cleaner/assets/btn.png);
        background-size: 100% 100%;
      }
    }
  }

  .circleProgress_wrapper {
    width: 120px;
    height: 120px;
    margin: 50px auto;
    position: relative;
    .wrapper {
      width: 60px;
      height: 120px;
      position: absolute;
      top: 0;
      overflow: hidden;
    }

    .right {
      right: -1px;
    }

    .left {
      left: -1px;
    }

    .circleProgress {
      box-sizing: border-box;
      width: 120px;
      height: 120px;
      border: 1px solid transparent;
      border-radius: 50%;
      position: absolute;
      top: -1px;
    }
    &.clean {
      .rightcircle {
        border-top: 1px solid yellow;
        border-right: 1px solid yellow;
        right: 0;
        animation: circleRight 5s linear infinite;
      }
      .leftcircle {
        border-bottom: 1px solid yellow;
        border-left: 1px solid yellow;
        left: 0;
        animation: circleLeft 5s linear infinite;
      }
    }
    @keyframes circleRight {
      0% {
        -webkit-transform: rotate(225deg);
      }

      50%,
      100% {
        -webkit-transform: rotate(405deg);
      }
    }

    @keyframes circleLeft {
      0%,
      50% {
        -webkit-transform: rotate(225deg);
      }

      100% {
        -webkit-transform: rotate(405deg);
      }
    }
  }

  &.great {
    .bg {
      background: #46bcff;
    }
    .wave-bg {
      background: #46bcff;
    }
  }
  &.good {
    .bg {
      background: #327dfe;
    }
    .wave-bg {
      background: #327dfe;
    }
  }
  &.normal {
    .bg {
      background: #2d37ef;
    }
    .wave-bg {
      background: #2d37ef;
    }
  }
  &.bad {
    .bg {
      background: #fe3232;
    }
    .wave-bg {
      background: #fe3232;
    }
  }
}

.modal-w.subpage {
  background: #fff;
}
.tds {
  padding: 56px 48px;
  font-size: 28px;
  color: #35353D;
  text-align: justify;
  .sub-title {
    padding: 48px 0;
  }
  .items {
    display: flex;
    justify-content: space-between;
    .item {
      width: 124px;
      height: 96px;
      line-height: 96px;
      border-radius: 10px;

      font-size: 24px;
      color: #fff;
      text-align: center;
      &.item1 {
        background: #46bcff;
      }
      &.item2 {
        background: #327dfe;
      }
      &.item3 {
        background: #2d37ef;
      }
      &.item4 {
        background: #fe3232;
      }
    }
  }
  .ruler {
    margin-top: 26px;
    list-style: none;
    opacity: 0.3;

    border-radius: 4px;

    border-bottom: 1px solid #35353D;

    display: flex;
    justify-content: space-between;
    li {
      background: #35353D;
      width: 1px;
      height: 12px;
    }
  }
  .name {
    margin-top: 8px;
    list-style: none;
    display: flex;
    justify-content: space-between;
  }
}
</style>

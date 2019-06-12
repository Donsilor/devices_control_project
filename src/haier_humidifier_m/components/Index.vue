<template>
  <div class="page">
    <div class="bg">
      <topbar
        :transparent="true"
        title="卧室的加湿器" />
      <!-- 离线提示 -->
      <div 
        v-show="isOffline"
        class="offline">
        <i class="attention" />
        设备已离线，查看帮助
      </div>

      <div class="main">
        <div class="wrap-num">
          <div class="num-item">
            <div class="num">46.4<sup>%</sup></div>
            <div>室外湿度</div>
          </div>
          <div class="num-item">
            <i class="icon" />
            <div class="num">26<sup>℃</sup></div>
            <div>室内温度</div>
          </div>
        </div>

        <div class="content center">
          <div class="status">
            <div class="num">20<sup>%</sup></div>
            <div>室内湿度，干燥</div>
          </div>
          <div class="list">
            <ul>
              <li v-for="i in 18">{{ i }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-btn">
      <div class="btn-wrap btns">
        <div class="btn btn-hh center circleProgress_wrapper">
          <div class="wrapper right">
            <div class="circleProgress rightcircle"/>
          </div>
          <div class="wrapper left">
            <div class="circleProgress leftcircle"/>
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
          <li/>
          <li/>
          <li/>
          <li/>
          <li/>
          <li/> 
        </ul>
        <ul class="name">
          <li>0</li>
          <li>50</li>
          <li>100</li>
          <li>200</li>
          <li>300+</li>
          <li/>
        </ul>
      </div>
    </sub-page>
  </div>
</template>

<script>
import SubPage from './SubPage.vue';
export default {
  components: {
    SubPage
  },
  data() {
    return {
      rank: 4,
      tdsModalVisible: false,
      isOffline: true
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    tdsModalVisibleControl() {
        //点击TDS按钮
        this.tdsModalVisible = !this.tdsModalVisible;
    },
    getSnapShot() {
      HdSmart.Device.getSnapShot(
        data => {
          console.log(data)
        },
        () => {
        }
      );
    },
    controlDevice(attr, val, success) {
        if (this.errors.length) {
            return;
        }

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
                success && success();
            },
            () => {}
        );
    },
  }
};
</script>
<style lang="less" scoped>
.page{
  min-height: 100%;
  background: #35353D;
  color: #fff;
  text-align: center;
  .offline {
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 64PX;
    left: 0;
    z-index: 99;

    padding-left: 48px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 88px;
    line-height: 88px;

    font-size: 32px;
    color: #fff;
    .attention {
      display: inline-block;
      width: 36px;
      height: 36px;
      background-image: url(../../../lib/base/air_condition/assets/new-air/icon-tips.png);
      background-size: 100% 100%;
      margin-right: 12px;
    }
    &:after {
      position: absolute;
      right: 50px;
      top: 50%;
      display: inline-block;
      content: "";
      width: 15px;
      height: 15px;
      border: 2px solid #fff;
      border-width: 2px 2px 0 0;
      -webkit-transform: translate(0, -50%) rotate(45deg);
      transform: translate(0, -50%) rotate(45deg);
    }
  }

  .main{
    padding: 0 48px;
    font-size: 24px;
    color: #fff;
    .wrap-num{
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #737373;
      .num-item{
        padding: 86px 86px 37px 86px;
        .num{
          position: relative;
          font-size: 80px;
        }
      }
    }
    .content{
      margin: 96px 0;
    }
    .status{
      margin-right: 167px;
      .num{
        font-size: 280px;
      }
    }
    sup{
      position: absolute;
      top: 10px;
      right: 10;
      font-size: 24px;
    }
  }

  .panel-btn{
    height: 306px;
    background: #35353D;
    box-shadow: 0 -3px 28px 0 rgba(17,17,17,0.50);
    border-radius: 42px 42px 0px 0px;
  }

  .btns {
    padding-top: 50px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #fff;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border: none;
      }
    }
    .btn-name{
      margin-top: 14px;
      font-size: 24px;
    }
    .btn-hh{
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
}

</style>

<template>
  <div :class="[ bgClass,'page']">
    <div class="bg">
      <topbar
        :transparent="true"
        title="大人的洗衣机" />
      <div class="main">
        <div class="title">过滤前水质：122 TDS</div>
        <div 
          class="wrap-num" 
          @click="tdsModalVisibleControl">
          <span class="num">
            24
            <span class="unit">TDS</span>
          </span>
        </div>
        <div class="msg">当前指数水质可以直饮</div>
      </div>
    </div>

    <div class="wrap-wave">
      <div class="wave-bg">
        <div class="wave">冲洗中…</div>
      </div>
    </div>

    <div class="wrap-filter">
      <div class="filter">
        <div class="filter-item">53<sup>%</sup></div>
        <div class="filter-name">剩余初滤滤芯</div>
      </div>
      <div class="filter">
        <div class="filter-item">60<sup>%</sup></div>
        <div class="filter-name">剩余吸附滤芯</div>
      </div>
      <div class="filter">
        <div class="filter-item">20<sup>%</sup></div>
        <div class="filter-name">剩余RO滤芯</div>
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
    }
  },
  computed: {
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
  background: #35353D;
  color: #fff;
  text-align: center;
  .bg{
    background: #FE3232;
  }
  .main{
    font-size: 24px;
    .title{
      margin-top: 126px;
      opacity: 0.5;
    }
    .wrap-num{
      margin-top: 40px;
      .num{
        position: relative;
        line-height: 1;
        font-size: 200px;
      }
      .unit{
        position: absolute;
        top: 56px;
        right: -40px;

        font-size: 24px;
      }
    }
    .msg{
      margin-top: 12px;
      padding-bottom: 131px;
    }
  }
  .wave-bg{
    background: #FE3232;
    border-radius: 0 0 750px 750px;
  }
  .wave{
    background-image: url(../../../lib/base/haier_water_cleaner/assets/wave.png);
    background-size: 165% 100%;

    width: 100%;
    padding: 221px 0 120px 0;
    font-size: 24px;

    border-radius: 0 0 750px 750px;
  }
  .wrap-filter{
    display: flex;
    justify-content: center;
  }
  .filter{
    margin: 60px 38px;
    .filter-item{
      font-size: 80px;
      sup{
        font-size: 24px;
      }
    }
    .filter-name{
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

    .rightcircle {
      border-top: 1px solid yellow;
      border-right: 1px solid yellow;
      right: 0;
    }

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
  
  &.great{
    .bg{
      background: #46BCFF;
    }
    .wave-bg{
      background: #46BCFF;
    }
  }
  &.good{
    .bg{
      background: #327DFE;
    }
    .wave-bg{
      background: #327DFE;
    }
  }
  &.normal{
    .bg{
      background: #2D37EF;
    }
    .wave-bg{
      background: #2D37EF;
    }
  }
  &.bad{
    .bg{
      background: #FE3232;
    }
    .wave-bg{
      background: #FE3232;
    }
  }
}

.modal-w.subpage{
  background: #35353D;
}
.tds{
  padding: 56px 48px;
  font-size: 28px;
  color: #fff;
  text-align: justify;
  .sub-title{
    padding: 48px 0;
  }
  .items{
    display: flex;
    justify-content: space-between;
    .item{
      width: 124px;
      height: 96px;
      line-height: 96px;
      border-radius: 10px;

      font-size: 24px;
      color: #fff;
      text-align: center;
      &.item1{
        background: #46BCFF;
      }
      &.item2{
        background: #327DFE;
      }
      &.item3{
        background: #2D37EF;
      }
      &.item4{
        background: #FE3232;
      }
    }
  }
  .ruler{
    margin-top: 26px;

    list-style: none;
    opacity: 0.3;

    border-radius: 4px;

    border-bottom: 1px solid #D8D8D8;

    display: flex;
    justify-content: space-between;
    li{
      background: #D8D8D8;
      width: 1px;
      height: 12px;
    }
  }
  .name{
    margin-top: 8px;
    list-style: none;
    display: flex;
    justify-content: space-between;
  }
}
</style>

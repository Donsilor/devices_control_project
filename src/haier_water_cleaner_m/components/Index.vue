<template>
  <div class="page">
    <div class="bg">
      <topbar
        :transparent="true"
        title="大人的洗衣机" />
      <div class="main">
        <div class="title">过滤前水质：122 TDS</div>
        <div class="wrap-num">
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
        <div class="filter-name">剩余初滤滤芯</div>
      </div>
      <div class="filter">
        <div class="filter-item">20<sup>%</sup></div>
        <div class="filter-name">剩余初滤滤芯</div>
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
    };
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
    padding: 198px 0 110px 0;
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
}
</style>

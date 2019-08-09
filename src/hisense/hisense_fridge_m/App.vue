<template>
  <div class="body">
    <div :class="[{ 'offline': isOffline }, 'page']">
      <topbar 
        :title="device.device_name"
        bak-color="#000" />
      <!-- 主体部分 -->
      <div class="main">
        <div class="item">
          <div class="title">
            <div class="left"><i class="icon icon-cold" />冷藏室<span class="tm">{{ deviceAttrs.tempContainer | filterTm }}℃</span></div>
            <div class="right icon-swich"/>
          </div>
          <div class="control-tm">
            <button class="control reduce"/>
            <div class="tm-progress">
              <div class="low">2℃</div>
              <div class="high">8℃</div>
            </div>
            <button class="control add"/>
          </div>
        </div>
        <div class="line"/>
        <div class="item">
          <div class="title">
            <div class="left"><i class="icon icon-change" />变温室<span class="tm">{{ deviceAttrs.tempVarTempChamber | filterTm }}℃</span></div>
            <div class="right icon-swich"/>
          </div>
          <div class="control-tm">
            <button class="control reduce"/>
            <div class="tm-progress">
              <div class="low">-18℃</div>
              <div class="high">5℃</div>
            </div>
            <button class="control add"/>
          </div>
        </div>
        <div class="line"/>
        <div class="item">
          <div class="title">
            <div class="left"><i class="icon icon-freeze" />冷冻室<span class="tm">{{ deviceAttrs.tempFreezer | filterTm }}℃</span></div>
          </div>
          <div class="control-tm">
            <button class="control reduce"/>
            <div class="tm-progress">
              <div class="low">-25℃</div>
              <div class="high">-15℃</div>
            </div>
            <button class="control add"/>
          </div>
        </div>
        <div class="c-status">速冻模式</div>
      </div>
      <!-- 按钮 -->
      <div class="panel-btn center">
        <div 
          class="more" 
          @click="handleMore">
          <div :class="[isOpen ? 'up': 'down', 'arrow']">></div>
          <div>{{ isOpen ? '收起' : '查看更多' }}</div>
        </div>

        <div class="btn-wrap">
          <div 
            class="btn-cold btn center" />
          <div class="btn-name">速冷</div>
        </div>

        <div 
          class="btn-wrap"
          @click="setMode('dy_expansion')">
          <div :class="[{ 'active': deviceAttrs.mode == 'dy_expansion' }, 'btn btn-freeze center']" />
          <div class="btn-name">速冻</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('heat_keep')">
          <div :class="[ { 'active': deviceAttrs.mode == 'heat_keep' }, 'btn btn-auto center']" />
          <div class="btn-name">智能</div>
        </div>
        <div 
          class="btn-wrap"
          @click="setMode('sterilization')">
          <div :class="[ { 'active': deviceAttrs.mode == 'sterilization' }, 'btn btn-holiday center']" />
          <div class="btn-name">假日 </div>
        </div>

        <div 
          v-show="isOpen" 
          class="btn-wrap">
          <div
            class="btn btn-energy center"/>
          <div class="btn-name">节能</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    ...mapGetters(['isOffline']),
    ...mapState(['device', 'deviceAttrs']),
  },
  created() {
  },
  methods: {
    ...mapActions(['doControlDevice']),
    handleMore() {
      this.isOpen = !this.isOpen
    },
    setMode() {

    },
    controlDevice(attr, value) {
      return this.doControlDevice({
        nodeid: `water_heater.main.${attr}`,
        params: {
          attribute: {
            [attr]: value
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.body {
  min-height: 100%;
}
.page {
  height: 100vh;
  min-height: 550px;
  overflow-x: hidden;
  position: relative;
  background: #e5faff;
  .main{
    margin: 40px 80px;
    .item{
      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        .left{
          display: flex;
          align-items: center;
          .icon{
            margin-right: 11px;
            display: inline-block;
            width: 28px;
            height: 28px;
            &.icon-change{
              background-image: url(~@lib/base/fridge/assets/change.png);
              background-size: 100% 100%;
            }
            &.icon-cold{
              background-image: url(~@lib/base/fridge/assets/cold.png);
              background-size: 100% 100%;
            }
            &.icon-freeze{
              background-image: url(~@lib/base/fridge/assets/freeze.png);
              background-size: 100% 100%;
            }
          }
          .tm{
            margin-left: 11px;
            font-size: 40px;
          }
        }
        .right{
          &.icon-swich{
            width: 37px;
            height: 37px;
            background-image: url(~@lib/base/fridge/assets/swich.png);
            background-size: 100% 100%;
          }
        }
      }
      .control-tm{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .control{
          outline: none;
          border: none;
          width: 72px;
          height: 72px;
          background: rgba(255,255,255,0.50);
          border-radius: 50%;
          &.add{
            background-image: url(~@lib/base/fridge/assets/add.png);
            background-size: 100% 100%;
          }
          &.reduce{
            background-image: url(~@lib/base/fridge/assets/reduce.png);
            background-size: 100% 100%;
          }
        }
        .tm-progress{
          flex: 1;
          margin: 45px 20px;
          height: 68px;
          border-radius: 44px;
          border-radius: 44px;
          border: 1px solid rgba(0,213,255,0.10);

          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 24px;
          color: #9E9E9E;
          .low{
            padding-left: 16px;
            display: flex;
            align-items: center;
            height: 100%;
            width: 50%;
            background: #00D5FF;
            border-radius: 44px 0 0 44px;
          }
          .high{
            padding-left: 16px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            text-align: right;
            height: 100%;
            width: 50%;
            background: rgba(255,255,255,0.50);
            border-radius: 0 44px 44px 0;
          }
        }
      }
    }
    .line{
      width: 100%;
      height: 1px;
      background: #a9f1ff;
      margin-bottom: 26px;
    }
  }
  .c-status{
    text-align: center;
    font-size: 24px;
    color: #20282B;
  }
  .panel-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 38px 0;
    z-index: 9999;

    background: #ffffff;
    box-shadow: 0 -3px 28px 0 rgba(209, 209, 209, 0.5);
    border-radius: 42px 42px 0px 0px;

    flex-wrap: wrap;
    justify-content: flex-start;
    .more {
      width: 750px;
      color: #9e9e9e;
      font-size: 24px;
      text-align: center;
      position: absolute;
      left: 0;
      top: -75px;
      .arrow {
        font-size: 32px;
        &.up {
          transform: rotate(90deg);
        }
        &.down {
          transform: rotate(-90deg);
        }
      }
    }
  }

  .btn-wrap {
    margin: 0 24px 24px;
    .btn {
      box-sizing: border-box;
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border: 1px solid #818181;
      border-radius: 50%;

      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        display: block;
        width: 44px;
        height: 44px;
      }
      &.active {
        background-image: linear-gradient(-90deg, #ffd500 0%, #ffbf00 100%);
        border-color: #ffbf00;
      }
    }
    .btn-name {
      text-align: center;
      color: #000;
      margin-top: 16px;
      font-size: 24px;
    }

    .btn-freeze {
      &::before {
        background-image: url(~@lib/base/fridge/assets/freeze-black.png);
        background-size: 100% 100%;
      }
    }
    .btn-cold {
      &::before {
        background-image: url(~@lib/base/fridge/assets/cold-black.png);
        background-size: 100% 100%;
      }
    }
    .btn-auto {
      &::before {
        background-image: url(~@lib/base/fridge/assets/auto-black.png);
        background-size: 100% 100%;
      }
    }
    .btn-holiday {
      &::before {
        background-image: url(~@lib/base/fridge/assets/holiday-black.png);
        background-size: 100% 100%;
      }
    }
    .btn-energy {
      &::before {
        background-image: url(~@lib/base/fridge/assets/energy-black.png);
        background-size: 100% 100%;
      }
    }
  }
  &.close,
  &.offline {
    .main {
      opacity: .2;
    }
    .c-status{
      opacity: 0;
    }
    &:before {
      content: "";
      position: fixed;
      top: 64PX;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 99999;
      width: 100%;
      background: rgba(0, 0, 0, 0.05);
    }
    .icon-swich{
      background-image: url(~@lib/base/fridge/assets/swich-black.png) !important;
      background-size: 100% 100%;
    }
    &.page{
      background: #fff;
      .btn-wrap {
        .btn {
          opacity: .2;
          &.active {
            background-image: #fff;
            border-color: none;
          }
        }
      }
    }
  }
}
</style>

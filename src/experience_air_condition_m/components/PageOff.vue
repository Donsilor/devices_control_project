<template>
  <div class="wrap-off">
    <!-- <div class="topbar topbar-fixed">
      <div class="left">
        <a
          href="#/"
          class="icon-return"
          @click.prevent="back"/>
      </div>
      <div class="title">{{ device.name }}</div>
      <div class="right">
        <a
          href=""
          class="icon-more"
          @click.prevent="goDetail"/>
      </div>

    </div> -->
    <topbar 
      :title="device.name" 
      bak-color="#000" />
    <!--<div class="bg"></div>-->

    <div class="header">
      <p class="name">
        <!--{{device.name}}
                <icon/>-->
        &nbsp;
      </p>
      <p class="status">已关闭</p>
    </div>

    <div class="ac1" />
    <!-- <div class="ac2" v-else></div> -->

    <div
      href="#"
      class="btn-on icon-switch"
      @click.prevent="setOn($event)"
    />

  </div>
</template>
<style lang="less">
.wrap-off {
  background: #f2f2f2;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 99999;
  .navbar .left a.icon-return {
    border-color: #000;
  }
}
</style>
<script>
import Icon from '../../../lib/components/SettingIconMobile.vue'
export default {
  components: {
    Icon
  },
  props: {
    control: {
      type: Function,
      default: null
    },
    device: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  mounted() {
    HdSmart.UI.setStatusBarColor(2)
  },
  methods: {
    goDetail() {
      HdSmart.UI.goDeviceDetail()
    },
    back() {
      HdSmart.UI.popWindow()
    },
    setOn(event) {
      this.control('switch', 'on', event.target)
    }
  }
}
</script>

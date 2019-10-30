<!-- 导航条 -->
<template>
  <div class="topbar">
    <div
      :style="{height:(status_bar_height + navigation_bar_height) +'px'}"
      class="topbar-block" />
    <div class="topbar-fixed">
      <div
        :style="{height:status_bar_height+'px'}"
        class="statusbar" />
      <div
        :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"
        class="navbar">
        <div class="left">
          <a
            href="#/"
            class="icon-return"
            @click.prevent="goBack" />
        </div>
        <div class="right">
          <router-link
            v-if="search"
            to="/search"
            class="search" />
          <a
            v-if="more"
            href=""
            class="icon-more"
            @click.prevent="goDetail" />
        </div>
        <div
          v-if="title"
          class="title">{{ title }}</div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>

// import { mapState } from 'vuex'
let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio
export default {
  props: {
    title: String,
    back: Function,
    search: {
      type: Boolean,
      default: true
    },
    more: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status_bar_height: 25,
      navigation_bar_height: 44
    }
  },
  // computed: mapState(['status_bar_height', 'navigation_bar_height']),
  created() {
    HdSmart.ready(() => {
      if (window.status_bar_height) {
        this.status_bar_height = window.status_bar_height / dpr
      }
      if (window.navigation_bar_height) {
        this.navigation_bar_height = window.navigation_bar_height / dpr
      }
    })
  },
  methods: {
    goDetail() {
      HdSmart.UI.goDeviceDetail()
    },
    goBack() {
      if (typeof this.back === 'function') {
        this.back()
      } else {
        this.$router.back()
      }
    }
  }
}
</script>
<style lang="less" scoped>
/* topbar */
@status_bar_height: 25PX;
@navigation_bar_height: 44PX;
.topbar-block, .topbar-fixed{
  background-color: #fff;
  // background-color: transparent;
}
.topbar-fixed{
  border-bottom: 0;
  .statusbar {
     height: @status_bar_height;
  }
  
}
.topbar .navbar {
  display: flex;
  align-items: center;
  justify-content: center;
   height: @navigation_bar_height;
  .left a.icon-return {
    position: absolute;
    left: 40px;
    top: 55%;
    display: inline-block;
    width: 14PX;
    height: 14PX;
    border: solid #000;
    border-width: 2px 2px 0 0;
    transform: translate(0, -50%) rotate(225deg);
  }

  .right a.icon-more {
    display: inline-block;
  }
}
.right{
  width: 44PX;
  display: flex;
  align-items: center;
}
.search{
  background: url('~@lib/base/img/tv_btn_search.png');
  background-size: 100% 100%;
  width: 48px;
  height: 48px;
  
}

</style>


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
            class="icon-search" />
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

import { mapState } from 'vuex'

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
    return {}
  },
  computed: mapState(['status_bar_height', 'navigation_bar_height']),
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
<style lang="less">
/* topbar */
.topbar .navbar {
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>


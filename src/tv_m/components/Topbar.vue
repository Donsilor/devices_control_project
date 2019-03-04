<!--
    导航条
-->
<template>
  <div class="topbar">
    <div
      :style="{height:(status_bar_height + navigation_bar_height) +'px'}"
      class="topbar-block" />
    <div class="topbar-fixed">
      <div
        :style="{height:status_bar_height+'px'}"
        class="statusbar"/>
      <div
        :style="{height:navigation_bar_height+'px'}"
        class="navbar" >
        <div class="left">
          <a
            href="#/"
            class="icon-return"
            @click.prevent="goBack"/>
        </div>
        <div class="right">
          <router-link
            to="/search"
            class="icon-search"/>
        </div>
        <div
          v-if="title"
          class="title">{{ title }}</div>
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  props: {
    title: String,
    back: Function
  },
  data() {
    return {}
  },
  computed: mapState(['status_bar_height', 'navigation_bar_height']),
  methods: {
    goBack() {
        if(typeof this.back === 'function'){
            this.back()
        }else{
             this.$router.back()
        }
    }
  }
}
</script>

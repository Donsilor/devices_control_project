<!--
    导航条
-->
<template>
  <div class="topbar">
    <div class="topbar-block"/>
    <div class="topbar-fixed">
      <div class="statusbar"/>
      <div class="navbar">
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
export default {
  props: {
    title: String
  },
  data() {
    return {}
    },
  methods: {
    goBack() {
      this.$router.back()
        }
  }
}
</script>

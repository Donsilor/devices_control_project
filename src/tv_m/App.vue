<template>
<div id="app">
    <router-view></router-view>
    <detail></detail>
    <offline-mask v-if="isNotHome" />
</div>
</template>

<style lang="less">
    *{
        padding: 0;
        margin: 0;
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
    }
    a{
        text-decoration: none;
    }
    ul{
        list-style: none;
    }
    .clearfix:after{
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    html{
        padding-bottom: 2px;
    }
    body{
        overflow-x: hidden;
        background: #fafafa;
        height: 100%;
        font-size: 28px;
    }
    body,input{
        font-family: NotoSansHans-Medium;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .page-list,.page-search{
        padding-bottom: 120px;
    }
    .detail-bd{
        padding-bottom: 300px;
    }
</style>

<script>
export default {
  computed: {
      isNotHome() {
          return this.$route.path != '/'
      }
  }
}
</script>

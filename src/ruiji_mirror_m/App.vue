<template>
  <div>
    <new-top-bar :scroll="true" title="锐吉魔镜"></new-top-bar>
    <status-tip></status-tip>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
  import NewTopBar from '@lib/components/NewTopBar.vue'
  import StatusTip from '@lib/components/StatusTip.vue'
  export default {
    components: {
      NewTopBar,
      StatusTip
    }
  }
</script>

<style>
  body{
    height: 100vh;
    background-color: #19191C;
  }

</style>

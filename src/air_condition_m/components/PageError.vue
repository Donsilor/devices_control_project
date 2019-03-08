<template>
  <div class="wrap-error">
    <div class="topbar topbar-fixed">
      <div class="left">
        <a
          href="#/"
          class="icon-return"
          @click.prevent="back"/>
      </div>
      <div class="title">{{ device.name }}</div>
    </div>

    <div
      class="error-tip"
      @click="reload()">
      <i/>
      加载失败，请点击屏幕刷新
    </div>
  </div>
</template>

<script>
export default {
    props: {
        reload: {
            type: Function
        }
    },
    methods: {
        back() {
            HdSmart.UI.popWindow()
        }
    }
};
</script>

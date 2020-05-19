<template>
  <div 
    class="wrap-error" 
    @click="reload()">
    <div class="error-tip">
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
    }
}
</script>

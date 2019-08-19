<template>
  <div 
    id="app"
    class="body">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isIOS: /iphone|ipad/i.test(navigator.userAgent),
    }
  },

}
</script>

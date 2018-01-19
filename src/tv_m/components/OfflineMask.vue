<template>
  <div class="mask" v-show="!$store.state.online" @touchmove.prevent="onTouchMove"></div>
</template>

<style scoped>
.mask{
    background: rgba(0,0,0,0);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
}
</style>

<script>
export default {
    methods: {
        onTouchMove() {
            return false
        }
    }
}
</script>

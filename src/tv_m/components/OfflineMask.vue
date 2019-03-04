<template>
  <div :style="maskStyle" class="mask" v-show="!$store.state.online" @touchmove.prevent="onTouchMove">
    <div/>
  </div>
</template>

<style scoped>
.mask{
    background: rgba(0,0,0,0);
    position: fixed;
    left: 0;
    top: 116px;
    width: 100%;
    height: 100%;
    z-index: 999;
}
.mask div{
    background: rgba(0,0,0,0);
    position: absolute;
    left: 88px;
    top: -116px;
    width: 100%;
    height: 100%;
}
</style>

<script>
export default {
    props: ['page'],
    computed: {
        maskStyle() {
            return this.page == 'index' ? {top:0+'px'} : ''
        }
    },
    methods: {
        onTouchMove() {
            return false
        }
    },
}
</script>

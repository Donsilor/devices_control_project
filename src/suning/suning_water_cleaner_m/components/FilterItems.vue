<template>
<div class="detail_content">
    <div class="lx_wrap" >
        <div class="time_tips">滤芯预计剩余使用时间</div>
        <div class="lx_item" v-for="(item,index) in items" :key="index" :class="{active:item.remaining==0}" @click="viewFilter(index)" >
            <div class="list_button">{{index+1}}</div>
            <div class="item-name">滤芯{{index+1}}<i></i></div>
            <div class="item-right">剩{{item.remaining}}% <span class="angle"></span></div>
        </div>
        <div class="lx_msg">实际剩余寿命受使用习惯及当地水质影响</div>
    </div>
    
    <div class="wave_content">
        <div class="waveHigh waveHigh1"></div>
        <div class="waveHigh waveHigh2"></div>
        <div class="waveHigh waveHigh3"></div>
    </div>
</div>
</template>
<style lang="less">

</style>
<script>
export default {
    props: ['items','viewFilter'],
}
</script>


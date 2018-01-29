<template>
<div>
    <div class="lx_title">滤芯预计剩余使用时间</div>
    <div class="lx_wrap">
        <div class="lx_item" v-for="(item,index) in items" :key="index" :class="{active:item.remaining==0}" @click="viewFilter(index)">
            <div class="item-name">滤芯{{index+1}}<i></i></div>
            <div class="item-left">剩{{item.remaining}}天</div>
        </div>
    </div>
    <div class="lx_msg">实际剩余寿命受使用习惯及当地水质影响，可点击滤芯查看详情</div>
</div>
</template>

<script>
export default {
    props: ['items','viewFilter']
}
</script>


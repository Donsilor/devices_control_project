<template>
<div class="detail_content" :class="{detailWaing:level>=4}">
    <div class="lx_title" @click="toggleModalVisible">
        <div class="main_tips" v-if="hasTDS">{{nowTDS}}</div>
        <div class="pic" :class="{'pic_100':nowTDS>=100}" v-if="hasTDS">TDS</div>
        <div class="levelTips" v-if="hasTDS">
            <span v-if="level==1">过滤后水质可直接饮用</span>
            <span v-else-if="level==2">过滤后水质不建议直接饮用</span>
            <span v-else-if="level==3">过滤后水质不建议直接饮用</span>
            <span v-else>过滤后水质不可直接饮用</span>
        </div>
    </div>
    
    <div class="lx_wrap" >
        <div class="time_tips">滤芯预计剩余使用时间</div>
        <div class="lx_item" v-for="(item,index) in items" :key="index" :class="{active:item.remaining==0}" @click="viewFilter(index)" >
            <div class="list_button">{{index+1}}</div>
            <div class="item-name">滤芯{{index+1}}<i></i></div>
            <div class="item-right">剩{{item.remaining | toDays}}天 <span class="angle"></span></div>
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
<script>
export default {
    props: ['items','viewFilter','nowTDS','level','hasTDS', 'toggleModalVisible'],
    methods: {

  }
}
</script>


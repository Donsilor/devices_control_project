<template>
  <div
    :class="{detailWaing:level>=4}"
    class="detail_content">
    <div
      class="lx_title"
      @click="toggleModalVisible">
      <div
        v-if="hasTDS"
        class="main_tips">{{ nowTDS }}</div>
      <div
        v-if="hasTDS"
        :class="{'pic_100':nowTDS>=100}"
        class="pic">TDS</div>
      <div
        v-if="hasTDS"
        class="levelTips">
        <span v-if="level==1">过滤后水质可直接饮用</span>
        <span v-else-if="level==2">过滤后水质不建议直接饮用</span>
        <span v-else-if="level==3">过滤后水质不建议直接饮用</span>
        <span v-else>过滤后水质不可直接饮用</span>
      </div>
    </div>

    <div class="lx_wrap" >
      <div class="time_tips">滤芯预计剩余使用时间</div>
      <div
        v-for="(item,index) in items"
        :key="index"
        :class="{active:item.remaining==0}"
        class="lx_item"
        @click="viewFilter(index)" >
        <div class="list_button">{{ index+1 }}</div>
        <div class="item-name">滤芯{{ index+1 }}<i/></div>
        <div class="item-right">剩{{ item.remaining | toDays }}天 <span class="angle"/></div>
      </div>
      <div class="lx_msg">实际剩余寿命受使用习惯及当地水质影响</div>
    </div>

    <div class="wave_content">
      <div class="waveHigh waveHigh1"/>
      <div class="waveHigh waveHigh2"/>
      <div class="waveHigh waveHigh3"/>
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


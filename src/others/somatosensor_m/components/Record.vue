<template>
  <div class="record">
    <div 
      class="topbar topbar-fixed" 
      style="background:transparent">
      <div 
        class="statusbar" 
        style="25px"/>
      <div 
        class="navbar" 
        style="height:44px; line-height: 44px">
        <div class="left">
          <router-link
            to="/"
            class="icon-return"
          />
        </div>
        <div 
          class="title" 
          style="font-weight:bold">
          人体侦测记录
        </div>
      </div>
    </div>
    <div class="main">
      <div 
        v-show="timeList!=''" 
        class="timeBox">
        <div class="title">
          <span>起始时间</span>
          <span>停留时长</span>
        </div>
        <ul>
          <li 
            v-for="item in timeList" 
            class="list">
            <span>{{ item.day }}</span>
            <span class="isgray">{{ item.time }}</span>
          </li>
        </ul>
      </div>
      <div 
        v-show="timeList==''" 
        class="picBox" >
        <img src="../../../../lib/base/somatosensor/assets/kong.png">
        <p>空空如也，暂无历史记录</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
   data() {
    return {
      timeList:[
        {day:'2019/09/27 12:33',time:'10小时32分钟'},
        {day:'2019/09/26 16:57',time:'32小时56分钟'},
        {day:'2019/09/25 23:24',time:'1小时7分钟'}
      ]
    }
  },
  methods: {
    
  }
}
</script>
<style lang="less" scoped>
@imgPath: 'base/somatosensor/assets';
  .record{
    height: 100vh;
    min-height: 550px;
    overflow-x: hidden;
    position: relative;
    background-image: url('~@lib/@{imgPath}/img_bg_02.png');
    background-size: 100% 100%;
    position: relative;
    .main{
      margin-top: 12vh;
      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 26px;
        color: #808080;
        margin-bottom: 30px;
        padding: 0 40px;
      }
      ul{
        .list{
          border-top: 1px solid rgba(0, 0, 0, 0.12);
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #000;
          height: 102px;
          padding: 0 40px;
          &:last-of-type{
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          }
          .isgray{
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
      .picBox{
        width: 264px;
        height: 250px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -132px;
        margin-top: -125px;
        img{
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -46px;
          margin-top: -210px;
          width: 92px;
          height: 116px;
        }
        p{
          font-size: 24px;
          margin-top: 80px;
          color: rgba(0, 0, 0, 0.39);
        }
      }
    }
  }
</style>
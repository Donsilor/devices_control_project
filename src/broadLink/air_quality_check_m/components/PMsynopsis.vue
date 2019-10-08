<template>
  <div class="page">
    <div class="top"/>
    <div class="header">
      <p class="title">PM2.5简介</p>
      <div 
        class="goback" 
        @click="$router.go(-1)">
        <span/>
      </div>
  
    </div>
    <div class="text">
      PM2.5指环境空气动力学当量直径小于等于2.5微米的颗粒物。它能较长时间悬浮于空气中，其在空气中含量浓度越高，就代表空气污染越严重。
    </div>
    <diV class="explain">
      PM2.5数值范围说明
    </diV>
    <ul class="list1">
      <li>优</li>
      <li>良</li>
      <li>轻度</li>
      <li>中度</li>
      <li>重度</li>
      <li>严重</li>
    </ul>
    <ul class="list2">
      <li/>
      <li/>
      <li/>
      <li/>
      <li/>
      <li/>
    </ul>
    <ul class="list3">
      <li>0</li>
      <li>35</li>
      <li>75</li>
      <li>115</li>
      <li>150</li>
      <li>250+</li>
    </ul>
  </div>
</template>


<style lang="less">
.page{
  width: 100%;
  padding: 0 40px;
  .top{
    width: 100%;
    height: 25PX;
  }
  .header{
    width: 100%;
    height: 80px;
    position: relative;
    span{
      position: absolute;
      top: 55%;
      display: inline-block;
      width: 12PX;
      height: 12PX;
      border: solid #000;
      border-width: 2PX 2PX 0 0;
      transform: translate(0, -50%) rotate(225deg);
    }
    .title{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 80px;
      font-size: 42px;
    }
  
  }
    .text{
      margin-top: 40px;
      font-size: 28px;
      line-height: 40px;
    }
    .explain{
      font-size: 30px;
      margin: 80px 0
    }
    .list1{
      display: flex;
      li{
        flex: 1;
        font-size: 24px;
        border-radius: 8px;
        height: 80px;
        width: 96px;
        text-align: center;
        line-height: 80px;
        margin-right: 10px;
        color: #fff;
        &:nth-child(1){
          background: #30D80A 
        }
        &:nth-child(2){
          background: #F5D100
        }
        &:nth-child(3){
          background: #F99F03
        }
        &:nth-child(4){
          background: #E31717
        }
        &:nth-child(5){
          background: #99004C
        }

        &:nth-child(6){
          background: #7E0023;
          margin:0
        }
      }
    }
    .list2{
      margin:10px 0; 
      display: flex;
      li{
        flex: 1;
        height: 10px;
        width: 100px;
        border:1px #000 solid;
        border-top:0;
        &:nth-child(2),&:nth-child(3),&:nth-child(4),&:nth-child(5),&:nth-child(6){
          border-left: 0;
        }
      } 
    }
    .list3{
      margin:10px 0; 
      display: flex;
      li{
        flex: 1;
        // width: 80px;
        font-size: 24px;
        position: relative;
        left: -20px;
        &:nth-child(1){
          left: 0;
        }
      } 
    }
}
.goback{
  height: 100%;
  width: 100px;
  position: relative;
  z-index: 100;
  left: -40px;
  padding-left: 40px;
}
</style>
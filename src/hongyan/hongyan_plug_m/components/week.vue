<template>
  <!-- <div
    class="cover"
    @click.self="$emit('flagClose', false)">
    <div 
      class="weekbox">
      <h3>重复</h3>
      <ul>
        <li 
          v-for="(item) in liList">
          <span>{{ item.week }}</span>
          <div 
            v-show="item.show"
            class="box" 
            @click="selectDay(item)"/>
          <img 
            v-show="!item.show"
            src="../../../../lib/base/hongyan_plug/assets/选中.jpg"
            alt="" 
            @click="selectDay(item)">
        </li>
      </ul>
      <div class="wrap-btns">
        <input 
          class="submit" 
          type="button"
          value="确定"
          @click="submit" >
        <div 
          class="cancel" 
          @click="cancel">取消</div>
      </div>
    </div>
  </div> -->
</template>

<script>
export default {
  data(){
    return{
      weekItem:{},
      weekArr:[],
      weekArr2: [],
      liList2: [],
     liList: [
        {week: '周日', show: true, order: 1},
        {week: '周一', show: true, order: 2},
        {week: '周二', show: true, order: 3},
        {week: '周三', show: true, order: 4},
        {week: '周四', show: true, order: 5},
        {week: '周五', show: true, order: 6},
        {week: '周六', show: true, order: 7}
      ]
    }
  },
  created() {
    this.weekArr2 = JSON.parse(JSON.stringify(this.weekArr))
    this.liList2 = JSON.parse(JSON.stringify(this.liList))
  },
  methods: {
    selectDay(item) {
      item.show = !item.show
      this.weekItem = item
      this.weekArr.forEach((element, index) => {
        if (element.week == item.week) {
          this.weekArr.splice(index, 1)
        }
      })
      this.weekArr.push(this.weekItem)
      // this.$emit('selectDay', this.weekArr)
    },
    cancelDay(item) {
      item.show = true
       newArr = this.weekArr.filter(item => {
        if (String(item.show) == 'true') {
          return true
        }
      })
    },
    submit(){
       this.weekArr2 = JSON.parse(JSON.stringify(this.weekArr))
      this.liList2 = JSON.parse(JSON.stringify(this.liList))
      this.$emit('selectDay', this.weekArr2)
      this.$emit('flagClose', false)
    },
    cancel(){
      this.weekArr = JSON.parse(JSON.stringify(this.weekArr2))
      this.liList = JSON.parse(JSON.stringify(this.liList2))
      this.$emit('selectDay', this.weekArr2)
      this.$emit('flagClose', false)
    }
  },
}
</script>

<style lang="less" scoped>
.cover{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;                              
    left: 0;
    overflow: auto;
    z-index: 99999;

    display: flex;
    align-items: center;
    justify-content: center;

    &:before{
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
    }
}
  .weekbox {
    width: 726px;
    height: 1168px;
    background-color: #fff;
    border-radius: 24px;
    z-index: 9999999;
    position: absolute;
    bottom: 12px;
    h3 {
      text-align: center;
      line-height: 116px;
      font-size: 40px;
      color: #20282B;
    }
    li{
      height: 102px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 32px;
      color: #20282B;
      border-bottom: 1px solid #F3F3F3;
      margin: 0 68px;
      .box {
        border: 1px solid #D8D8D8;
        width: 34px;
        height: 34px;
        border-radius: 50%;
      }
    }
    .wrap-btns{
        text-align: center;
        display: flex;
        align-items: center;
        flex-direction: column;
      }
      .submit{
        width: 646px;
        height: 100px;
        margin: 40px auto 32px auto;
        outline: none;
        background-image: linear-gradient(90deg, #FFD500 2%, #FFBE00 100%);
        border-radius: 71px;
        font-size: 32px;
        color: #000000;
        text-align: center;
        border: none;
      }
      .cancel{
        color: #FFC700;
        font-size: 32px;
        line-height: 44px;
      }
  }
</style>
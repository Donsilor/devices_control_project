<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main show">
      <div class="title">请输入开关名称</div>
      <div class="txt">
        <input
          ref="gain"
          v-model="txtVal"
          type="text"
          class="text"
          maxlength="10"
          autofocus="autofocus"
          @input="txt"
          @blur="handlePhone">
      </div>
      <div
        class="hide determine"
        @click="setWind">确定</div>
      <div
        class="hide"
        @click.self="show = false">取消</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@imgPath: 'base/air_condition/assets/new-air';
@imgPath1: "base/hongyan_light/assets";

@keyframes show {
    0% {
      bottom:-380px;
    }
    100% {
       bottom:0;
    }
}
// .show{
//   animation: show .2s linear 0s;
// }
input:focus { outline: none; }
input {
  caret-color: rgba(255,255,255,0.5) !important;
}
  .model{
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
    .main{
      position: absolute;
      z-index: 999999999999;
      width: 85%;
      background: #1E1E1E;
      padding: 48px 40px 20px;
      border-radius: 10px;
      .title {
        font-size: 36px;
        color: #fff;
        line-height: 30px;
        margin-bottom: 32px;
        text-align: center;
      }
      .txt {
        .text {
          height: 104px;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          font-size: 32px;
          padding: 20px;
          background: #1E1E1E;
          color: rgba(255,255,255,0.5);
        }
      }
      .line {
        padding: 0px 60px;
        width: 90%;
        height: 1px;
        opacity: .1;
        background: #F0F2F4;
      }
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        .btn{
          padding: 0px 60px;
          width:100%;
          height:120px;
          line-height: 120px;
          font-size:32px;
        }
        .img {
          margin: 0 60px 0 0;
          width: 48px;
          height: 48px;
          background: url("~@lib/@{imgPath1}/btn_ac_rihgt.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .hide{
        width: 100%;
        height: 100px;
        font-size: 32px;
        letter-spacing: 0;
        text-align: center;
        line-height: 100px;
        background: #1E1E1E;
        border-radius: 10px;
        color: #E1B96E;
      }
      .determine {
        margin-top: 52px;
        background-image: linear-gradient(225deg, #F9BB6B 0%, #EF6D5E 100%);
        border-radius: 10px;
        color: #000000;
      }
    }
  }
</style>
<script>
import { mapState } from 'vuex'
export default {
  props: ['num', 'argv_is_mock', 'remarks'],
  data() {
    return {
      show: false,
      txtVal: '',
      flag: true,
      numLength: true
    }
  },
  computed: {
    ...mapState(['device']),
  },
  watch: {
    'show'() {
      if(this.remarks) {
        this.txtVal = this.remarks
      } else {
        if(this.num == 'one') this.txtVal = '左下键'
        if(this.num == 'two') this.txtVal = '左上键'
        if(this.num == 'three') this.txtVal = '右上键'
        if(this.num == 'four') this.txtVal = '右下键'
      }
      this.numLength = true
      this.flag = true
      if(this.show == false) {
        this.txtVal = ''
      } else {
        this.$nextTick(() => {
          this.$refs.gain.focus()
        },100)
      }
    }
  },
  mounted() {
  },
  methods: {
    txt(e) {
      e.preventDefault()
      let reg = new RegExp("^[0-9\u4e00-\u9fa5]+$")
      if(e.target.value) {
        if(reg.test(e.target.value)) {
          this.flag = true
          if(e.target.value.length >= 2) {
            this.txtVal = e.target.value
            this.flag = true
            this.numLength = true
          } else {
            this.numLength = false
          }
        } else {
          this.flag = false
        }
      }
      this.txtVal = e.target.value
    },
    handlePhone() {
      // 修复ios 隐藏软键盘页面没有下滑问题
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)
    },
    setWind(){
      if(argv_is_mock) {
        if(!this.txtVal) return HdSmart.UI.toast('开关名称不能为空', null, true)
        if(!this.flag) return HdSmart.UI.toast('只能输入中文和数字', null, true)
        if(!this.numLength) return HdSmart.UI.toast('最少需要2个字', null, true)
      } else {
        if(!this.txtVal) return HdSmart.UI.toast('开关名称不能为空')
        if(!this.flag) return HdSmart.UI.toast('只能输入中文和数字')
        if(!this.numLength) return HdSmart.UI.toast('最少需要2个字')
      }
      this.$emit('setWind', this.txtVal)
    }
  }
}
</script>

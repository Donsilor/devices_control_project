<template>
  <div
    v-if="show"
    class="model"
    @click.self="show = false"
    @touchmove.prevent>
    <div class="main show">
      <div class="title">解绑面板</div>
      <div
        v-show="flagMode==false"
        class="title small">解绑面板后，面板直连设备将同时解绑</div>
      <!-- <div
        v-show="flagMode==true"
        class="txt">
        <input
          :value="txtVal"
          placeholder="输入验证码"
          type="text"
          class="text"
          maxlength="6"
          @input="txt"
          @blur="handlePhone">
        <div
          class="button"
          @click="button">{{ codeText }}</div>
      </div> -->
      <div
        class="hide determine"
        @click="flagMode == false ? setNext() : setUntying()">{{ flagMode == false ? '下一步' : '立即解绑' }}</div>
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
      // bottom: 0;
      z-index: 999999999999;
      width: 85%;
      // height: 381px;
      // color: #20282B;
      background: #1E1E1E;
      // border: 1px solid #DDDDDD;
      padding: 48px 40px 20px;
      border-radius: 10px;
      .title {
        font-size: 36px;
        color: #fff;
        line-height: 30px;
        margin-bottom: 32px;
        text-align: center;
        &.small {
          font-size: 28px;
        }
      }
      .txt {
        border-bottom: 1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        input:focus { outline: none; }
        .text {
          height: 104px;
          opacity: 0.5;
          width: 70%;
          border: none;
          border-radius: 10px;
          font-size: 32px;
          padding: 20px;
          background: #1E1E1E;
          color: #fff;
        }
        .button {
          font-size: 32px;
          background-image: linear-gradient(45deg, #EF6D5E 0%, #F9BB6B 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
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
        // flex-direction: column;
        background: #fff;
        .btn{
          padding: 0px 60px;
          width:100%;
          height:120px;
          line-height: 120px;
          // text-align: center;
          font-size:32px;
          // &:first-of-type{
          //   border-bottom:1px solid #F0F2F4;
          // }
          // &.title {
          //   font-size: 40px;
          // }
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
        // margin-top:21px;
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
export default {
  props: ['family'],
  data() {
    return {
      show: false,
      txtVal: '',
      flag: false,
      phone: '',
      codeText: '获取验证码',
      setTerval: null,
      setOut: null,
      isdisabled: false,
      flagMode: false
    }
  },
  watch: {
    'show'() {
      if(this.show == false) {
        this.txtVal = ''
        this.flagMode = false
        clearInterval(this.setTerval)
        clearTimeout(this.setOut)
        this.isdisabled = false
        this.codeText = "获取验证码"
      }
    }
  },
  mounted() {
    HdSmart.ready(() => {
      HdSmart.Util.getAppInfo(res => {
        console.log(res, 'getAppInfo数据')
        this.phone = res.uname
      })
    })
  },
  methods: {
    // 下一步
    setNext() {
      this.flagMode = true
    },
    // @input
    txt(e) {
      e.preventDefault()
      let reg = new RegExp("^[0-9]+$")
      if(e.target.value) {
        if(reg.test(e.target.value)) {
          this.txtVal = e.target.value
          this.flag = true
        } else {
          if(e.target.value.length >= 1) {
            this.flag = false
          }
        }
      }
      this.txtVal = e.target.value
    },
    // 修复ios 隐藏软键盘页面没有下滑问题
    handlePhone() {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)
    },
    // 解绑
    setUntying(){
      // if(!this.txtVal) return HdSmart.UI.toast('请输入验证码')
      // if(!this.flag) return HdSmart.UI.toast('请输入数字')
      // this.checkPhoneCode()
      // .then((res) => {
        // if(res.code == 0) {
          this.unbindRouter()
          .then((res) => {
            if(res.code == 0) {
              HdSmart.UI.goHomePage()
            } else {
              HdSmart.UI.toast('解绑失败')
            }
          })
          .catch(() => {
            HdSmart.UI.toast('解绑失败')
          })
        // }
      // })
      this.$emit('setUntying', this.txtVal)
    },
    //获取手机验证码
    button() {
      if(this.isdisabled) return
      this.setTime()
    },
    // 倒计时
    setTime() {
      HdSmart.UI.vibrate()
      let time = 60
      let i = 0
      let that = this
      that.setTerval = setInterval(function() {
        that.codeText = (--time)+"秒"
        i++
        if (i==1) {
          that.isdisabled=true
          that.getPhoneCode()
        }
      }, 1000)
      that.setOut = setTimeout(function() {
        that.isdisabled=false
        that.codeText = "获取验证码"
        clearInterval(that.setTerval)
      }, time * 1000)
    },
    //获取手机验证码接口
    getPhoneCode() {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({
            "phone": this.phone,
            "type": 4
        }, (data) => {
          resolve(data)
        },(err)=>{
          reject(err)
        },'um_get_phone_code')
      })
    },
    //校验手机验证码
    checkPhoneCode() {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({
            "phone": this.phone,
            "type": 4,
            "code": this.txtVal
        }, (data) => {
          resolve(data)
        },(err)=>{
          reject(err)
        },'um_check_phone_code')
      })
    },
    //解绑接口
    unbindRouter() {
      return new Promise((resolve, reject) => {
        HdSmart.Device.control({
          "family_id": this.family,
          "router_uuid":window.router_uuid
        }, (data) => {
          resolve(data)
        },(err)=>{
          reject(err)
        },'fm_unbind_router')
      })
    },
  }
}
</script>

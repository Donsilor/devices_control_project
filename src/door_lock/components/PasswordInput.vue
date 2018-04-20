<template>
<div class="password-input" v-show="visible">
    <div class="password-input-container">
        <div class="password-input-title">
            {{msg}}
            <a href="javascript:void(0)" @click="close" class="close"></a>
        </div>
        <div class="password-input-content">
            <input type="password" readonly :value="psw_str">
            <a v-show="psw.length>0" href="javascript:void(0)" @touchstart="delNum" class="del"></a>
            <div class="password-input-btns">
                <a  v-for="(item,index) in btns" href="javascript:void(0)"
                    :key="item" @touchstart="numberPressed(item)"
                    :class="['btn-item',(index+1)%3==0 ? 'item-wrap' : '']">{{item}}
                </a>
                <a href="javascript:void(0)" class="unlock"  @click="unlock">
                    <span class="unlock-btn" :class="{'unlock-disabled':disabled}">开锁</span>
                </a>
            </div>
        </div>
    </div>
</div>
</template>


<style lang="less" scoped>
.password-input {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  .password-input-container {
    background: #ffffff;
    // box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    width: 600px;
    padding-bottom: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-300px, -450px, 0);

    .password-input-title {
      box-shadow: inset 0 -1px 0 0 #dbdbdb;
      width: 100%;
      height: 84px;
      line-height: 84px;
      text-align: center;
      position: relative;
      font-size: 30px;
      color: #76787a;
      .close {
        width: 30px;
        height: 30px;
        display: inline-block;
        position: absolute;
        top: 27px;
        right: 26px;
        background: url(../assets/btn_close_normal.png) no-repeat;
        background-size: 30px;
        &:active {
          background-image: url(../assets/btn_close_pressed.png);
        }
      }
    }
    .password-input-content {
      padding: 30px 48px 0;
      position: relative;
      input {
        width: 504px;
        height: 96px;
        font-size: 54px;
        letter-spacing: 12px;
        background: #f2f2f2;
        border-radius: 6px;
        outline: none;
        text-indent: 36px;
        -webkit-appearance: none;
        border: none;
      }
      .del {
        position: absolute;
        width: 48px;
        height: 48px;
        right: 84px;
        top: 54px;
        background: url(../assets/btn_input_back_normal.png) no-repeat;
        background-size: 48px;
        &:active {
          background-image: url(../assets/btn_input_back_pressed.png);
        }
      }
      .password-input-btns {
        padding-left: 12px;
        position: relative;
        .btn-item {
          width: 120px;
          height: 120px;
          line-height: 120px;
          display: inline-block;
          text-align: center;
          font-size: 42px;
          color: #46bcff;
          margin-top: 26px;
          margin-right: 60px;
          background: #ffffff;
          border-radius: 100%;
          &.item-wrap {
            margin-right: 0;
          }
          &:active {
            background: rgba(70, 188, 255, 0.3);
          }
        }
        .unlock {
          width: 120px;
          height: 120px;
          line-height: 120px;
          display: inline-block;
          text-align: center;
          background: #ffffff;
          position: absolute;
          bottom: 0;
          right: 0;
          .unlock-btn {
            background: #46bcff;
            border-radius: 6px;
            display: inline-block;
            width: 120px;
            height: 84px;
            line-height: 84px;
            font-size: 36px;
            color: #ffffff;
            &.unlock-disabled {
              background: rgba(70, 188, 255, 0.3);
            }
          }
        }
      }
    }
  }
}
</style>


<script>
export default {
  props: ["visible"],
  data() {
    return {
      msg: "请输入开锁密码",
      psw: [],
      btns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0"]
    };
  },
  computed: {
    psw_str() {
      return this.psw.join("");
    },
    disabled() {
      if (this.psw.length < 6) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    numberPressed(num) {
      if (num != "C") {
        if (this.psw.length == 12) {
          return;
        }
        this.psw.push(num);
      } else {
        this.psw.splice(0, this.psw.length);
      }
    },
    delNum() {
      this.psw.splice(this.psw.length - 1, 1);
    },
    unlock() {
      if (this.disabled) {
        return;
      }
      let tmp = this.psw.map(x => {
        return (x.charCodeAt(0) ^ 0xa5).toString(16);
      });
    //   alert(tmp.join(''))
      this.reset();
      //发送指令
      HdSmart.Device.control(
        {
          method: "dm_set",
          nodeid: "doorlock.main.switch",
          params: {
            attribute: {
              switch: "on",
              pwd: tmp.join('')
            }
          }
        },
        (data) => {
            if(data.msg != 'TcpClient send msg success'){
                HdSmart.UI.toast("开锁成功");
                setTimeout(() => {
                    this.$parent.passwordInputVisible = false;
                },300)
            }
        },
        (data) => {
            if(data.code == -16005){
                HdSmart.UI.toast("密码错误，请重新输入");
            }else{
                HdSmart.UI.toast("开锁失败！");
            }
        }
      );
    },
    close() {
      this.reset();
      this.$emit("close-dialog"); //通知父组件
    },
    reset() {
      this.psw.splice(0, this.psw.length);
    }
  }
};
</script>

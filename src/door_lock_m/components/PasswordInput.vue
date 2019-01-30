<template>
  <div v-show="visible" class="password-input">
    <div class="password-input-container">
      <div class="password-input-title">
          <p class="close-box"><a href="javascript:void(0)" class="close" @click="close"/></p>
          <h3>{{ msg }}</h3>
      </div>
      <div class="password-input-content">
        <input :value="psw_str" type="password" readonly>
        <div class="password-input-mask"/>
        <a v-show="psw.length>0" href="javascript:void(0)" class="del" @touchstart="delNum"/>
        <div class="password-input-btns">
          <a v-for="(item,index) in btns" :key="item" :class="['btn-item',(index+1)%3==0 ? 'item-wrap' : '']" href="javascript:void(0)" @touchstart="numberPressed(item)">{{ item }}
          </a>
          <a href="javascript:void(0)" class="unlock" @click="unlock">
            <span :class="{'unlock-disabled':disabled}" class="unlock-btn">开锁</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {
      msg: '请输入开锁密码',
      psw: [],
      btns: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0']
    }
  },
  computed: {
    psw_str() {
      return this.psw.join('')
    },
    disabled() {
      if (this.psw.length < 6) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    numberPressed(num) {
      if (num != 'C') {
        if (this.psw.length == 12) {
          return
        }
        this.psw.push(num)
      } else {
        this.psw.splice(0, this.psw.length)
      }
    },
    delNum() {
      this.psw.splice(this.psw.length - 1, 1)
    },
    unlock() {
      if (this.disabled) {
        return
      }
      const tmp = this.psw.map(x => {
        return (x.charCodeAt(0) ^ 0xa5).toString(16)
      })
      //   alert(tmp.join(''))
      this.reset()
      // 发送指令
      HdSmart.Device.control(
        {
          method: 'dm_set',
          nodeid: 'doorlock.main.switch',
          params: {
            attribute: {
              switch: 'on',
              pwd: tmp.join('')
            }
          }
        },
        data => {
          // if(data.msg != 'TcpClient send msg success'){
          HdSmart.UI.toast('开锁成功')
          setTimeout(() => {
            this.$parent.passwordInputVisible = false
          }, 300)
          // }
        },
        data => {
          if (data.code == -16005) {
            HdSmart.UI.toast('密码错误，请重新输入')
          } else if (data.code == -1) {
            HdSmart.UI.toast('请求超时，请稍后重试')
          } else {
            HdSmart.UI.toast('开锁失败！')
          }
        }
      )
    },
    close() {
      this.reset()
      this.$emit('close-dialog') // 通知父组件
    },
    reset() {
      this.psw.splice(0, this.psw.length)
    }
  }
}
</script>

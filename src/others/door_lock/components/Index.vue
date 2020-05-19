<template>
  <div class="page-index">
    <icon />
    <div class="name">{{ device_name }}</div>

    <div class="lock-status">
      <span :class="{red:lockedStatus,on:model.switch=='on'}" class="status">{{ statusText }}</span>
      <span :class="{low:lowBattery}" class="battery">{{ model.battery_percentage }}%电量</span>
    </div>
    <div :class="[model.switch]" class="lock"/>

    <a :class="{disabled:btnDisabled}" href="#" class="btn-unlock" @click.prevent="showPwdInput">开锁</a>

    <router-link v-if="family_id" :to="{name:'log',query:{device_id:device_id,family_id:family_id, category_id: device_category_id}}" class="btn-golog"/>

    <!-- 旧的告警提醒
        <div class="alert-wraper">
            <div class="alert" :class="{warn:item.key}" v-for="(item,index) in theUnclickAlert" :key="index" v-if="index==0">
                <i></i>{{item.msg}}
                <a class="close" href="javascript:void(0)" @click="closeAlert(item)"></a>
            </div>
        </div>
        -->
    <password-input :visible="passwordInputVisible" @close-dialog="passwordInputVisible=false" />

    <alert-button :alert-model="alertModel" @goAlertpage = "goAlertpage('doorlock_errorsStorage')"/>
  </div>
</template>

<script>
import PasswordInput from './PasswordInput.vue'
import Icon from '../../../lib/components/SettingIcon.vue'
import { WARN_CODE } from './const'
import AlertButton from '../../../lib/components/AlertButton'
/**
 *  {0, "e0", "not fully locked"}, // 未锁好
    {1, "e3", "tamper alarm: "},   // 防拆
    {2, "e4", "hijacked"},         // 挟持
    {3, "e2", "wrong code entry limit"}, // 密码试探
    {4, "e1", "battery low power"},      // 低电量
    {5, "e5", "dead locked"},            // 锁死
    {6, "e6", "dead bolt on"},      //反锁
    {7, "e7", "remote open disabled"} //禁止远程开锁
 */
// switch理解为disabled

function findIndex(array, fn) {
  for (var i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return i
    }
  }
  return -1
}

export default {
  components: {
    PasswordInput,
    Icon,
    AlertButton
  },
  data() {
    return {
      hasSnapShot: false,
      device_name: '',
      device_id: '',
      family_id: '',
      passwordInputVisible: false,
      alertModel: [],
      model: {
        switch: 'off',
        battery_percentage: '--'
      },
      errorStore: [],
      device_category_id: '',
      errorsArray: [], // 报警接口返回的数据
      errorsStorage: [] // 存储在localStorage的error信息
    }
  },
  computed: {
    lowBattery() {
      return this.model.battery_percentage <= 15
    },
    btnDisabled() {
      let status = this.model.switch == 'on'
      this.alertModel.forEach(function(v, i) {
        status = v.switch || status
      })
      return status
    },
    // theUnclickAlert() {
    //     var hasE5 = findIndex(this.alertModel, item => {
    //         return item.code == "e5";
    //     });
    //     var result = this.alertModel.filter(item => {
    //         if (item.clicked) {
    //             return false;
    //         }
    //         if (item.code == "e6") {
    //             return false;
    //         }
    //         if (item.code == "e2" && hasE5 >= 0) {
    //             return false;
    //         }
    //         return true;
    //     });
    //     return result.reverse();
    // },
    lockedStatus() {
      var hasE6 = findIndex(this.alertModel, item => {
        return item.code == 'e6'
      })
      return hasE6 >= 0
    },
    statusText() {
      if (this.lockedStatus) {
        return '已反锁'
      }
      if (this.model.switch == 'on') {
        return '已打开'
      }
      return '已关闭'
    }
  },
  watch: {
    btnDisabled(val) {
      if (val) {
        this.passwordInputVisible = false
      }
    },
    // JOINT-1195：门锁在线，门锁页面一直显示门锁已打开状态。小概率出现
    'model.switch'(val) {
      clearTimeout(this.switchTimer)
      if (val == 'on') {
        this.switchTimer = setTimeout(() => {
          this.model.switch = 'off'
        }, 8000)
      }
    }
  },
  created() {
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name
      }
      HdSmart.UI.showLoading()
      setTimeout(() => {
        this.getSnapShot()
      }, 150)
    })

    HdSmart.onDeviceStateChange(data => {
      this.onSuccess(data.result)
    })
    HdSmart.onDeviceAlert(data => { // 设备启动时主动获取告警信息
      // this.onAlert(data.result.attribute.error);
      this.onAlertError(data.result)// 得到错误信息，单条上报
    })
  },
  mounted() {
    const errorsStorage = JSON.parse(window.localStorage.getItem('doorlock_errorsStorage')) || []// 得到本地缓存
    this.alertModel = errorsStorage.filter((item, index) => {
      return item.clicked === false
    })
  },
  methods: {
    goAlertpage(localStorageName) {
      // 要传入给页面的alert信息
      this.$store.commit('showAlertpage', { queryInfo: this.alertModel, localStorageName: localStorageName })
      this.$router.push({ path: '/AlertPage' })
    },
    showPwdInput() {
      if (this.btnDisabled) {
        return
      }
      this.passwordInputVisible = true
    },
    onAlertError(err) { // 单个的错误上报
      // err={
      //     "family_id": 1,
      //     "device_id": 111222233333,
      //     "device_uuid":"112233445566778810",
      //     "device_category_id": 'xxx',
      //     "code":"e0",
      //     "level": 1,
      //     "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
      //     "updated_at": 1498047283,
      // }
      if (err) {
        const store = window.localStorage
        let errorsStorage = []
        if (store.getItem('doorlock_errorsStorage')) { // 本地已经有存储
          errorsStorage = JSON.parse(store.getItem('doorlock_errorsStorage'))// 得到本地缓存
          this.storageDeal(err, errorsStorage)// 对这一项（err）进行处理，内存中值保存status为1的告警信息，返回新的内存信息
          store.setItem('doorlock_errorsStorage', JSON.stringify(errorsStorage))// 设置新的告警信息
        } else { // 本地缓存为空
          if (parseInt(err.status, 10) === 1) {
            errorsStorage.push({
              msg: WARN_CODE[err.code].msg,
              text: WARN_CODE[err.code].text,
              code: err.code,
              key: 1,
              switch: WARN_CODE[err.code].switch,
              clicked: false,
              status: err.status
            })
          } else {
            return
          }
          // console.log(9999999999,JSON.parse(window.localStorage.getItem('doorlock_errorsStorage')))
          store.setItem('doorlock_errorsStorage', JSON.stringify(errorsStorage))// 设置新的告警信息
        }
        this.alertModel = errorsStorage.filter((item, index) => {
          return item.clicked === false
        })
        // console.log("this.alertModel32222",this.alertModel)
      }
    },
    onAlarmError(attr) { // status全为1，设备自动发送告警信息
      const errors = attr ? attr.error : []// 设备上报的错误
      //  errors=[{
      //     "family_id": 1,
      //     "device_id": 111222233333,
      //     "device_uuid":"112233445566778810",
      //     "device_category_id": 'xxx',
      //     "code":"e2",
      //     "level": 1,
      //     "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
      //     "updated_at": 1498047283,
      // },{
      //     "family_id": 1,
      //     "device_id": 111222233333,
      //     "device_uuid":"112233445566778810",
      //     "device_category_id": 'xxx',
      //     "code":"e4",
      //     "level": 1,
      //     "status":1,    // 0：告警消除，1：新告警，2：自动恢复告警，3：手工恢复，4：忽略
      //     "updated_at": 1498047283,
      // }]
      const store = window.localStorage
      let errorsStorage = []
      if (errors && errors.length > 0) {
        if (store.getItem('doorlock_errorsStorage')) { // 本地已经有存储
          errorsStorage = JSON.parse(store.getItem('doorlock_errorsStorage')) || []// 得到本地缓存
          errorsStorage = this.dealErrors(errors, errorsStorage)// 只保留尚存的告警，内存里的其他告警一并删除
          errors.forEach((item, index) => {
            this.storageDeal(item, errorsStorage)// 对这一项（item）进行处理，内存中值保存status为1的告警信息，返回新的内存信息
          })
          store.setItem('doorlock_errorsStorage', JSON.stringify(errorsStorage))// 设置新的告警信息
        } else { // 本地缓存为空
          errors.forEach((item, index) => {
            if (parseInt(item.status, 10) === 1) {
              errorsStorage.push({
                msg: WARN_CODE[item.code].msg,
                text: WARN_CODE[item.code].text,
                code: item.code,
                key: 1,
                switch: WARN_CODE[item.code].switch,
                clicked: false,
                status: item.status
              })
            } else {
              return
            }
          })
          store.setItem('doorlock_errorsStorage', JSON.stringify(errorsStorage))// 设置新的告警信息
        }
        // console.log(99999,JSON.parse(window.localStorage.getItem('doorlock_errorsStorage')))
        this.alertModel = errorsStorage.filter((item, index) => {
          return item.clicked === false
        })
        // console.log("this.alertModel11111",this.alertModel)
      } else { // 没有告警
        store.setItem('doorlock_errorsStorage', JSON.stringify([]))
        this.alertModel = []
      }
    },
    storageDeal(item, errorsStorage) { // 用来判断内存中(errorsStorage)是否存在某个error(item)的方法
      let isHave = false// 标记内存中是否存在这个告警
      for (let i = 0; i < errorsStorage.length; i++) {
        if (item.code == errorsStorage[i].code) {
          isHave = true
          break
        } else {
          isHave = false
        }
      }
      if (isHave) { // 已经存在这个错误，并且已经保存在内存中
        if (parseInt(item.status, 10) === 1) { // 告警没有解除，再次触发,但clicked状态若是true的要变为false
          return
        } else if (parseInt(item.status, 10) === 0) { // 0：告警消除，把他从内存里面删除
          errorsStorage.forEach((err, i) => {
            if (item.code == err.code) { // 说明这个告警已经解除，将其从localstorage里删除
              errorsStorage.splice(i, 1)
            }
          })
        }
      } else { // 没有存在这个告警，如果是1存在内存中吗，0则退出
        if (parseInt(item.status, 10) === 1) { // 新增的告警，添加到内存中
          errorsStorage.push({
            msg: WARN_CODE[item.code].msg,
            text: WARN_CODE[item.code].text,
            code: item.code,
            key: 1,
            switch: WARN_CODE[item.code].switch,
            clicked: false,
            status: item.status
          })
        } else if (parseInt(item.status, 10) === 0) { // 0：告警消除，把他从里面删除
          return
        }
      }
      return errorsStorage
    },
    dealErrors(errors, errorsStorage) {
      const arr = []// 保存内存和告警相同的项
      for (let i = 0; i < errors.length; i++) {
        for (let j = 0; j < errorsStorage.length; j++) {
          if ((errors[i].code === errorsStorage[j].code) && (errors[i].status == 1)) { // status为0，告警已经解除的也一并删除
            arr.push(errors[i].code)
          }
        }
      }
      console.log(11111, arr)// 找到数组中相同的项
      let newErrorsStorage = []
      if (arr && arr.length > 0) {
        newErrorsStorage = errorsStorage.filter((item, index) => {
          return arr.indexOf(item.code) > -1
        })
      }
      console.log(22222, newErrorsStorage)
      return newErrorsStorage
    },
    getSnapShot(cb) {
      HdSmart.Device.getSnapShot(
        data => {
          this.onSuccess(data)
        },
        () => {
          HdSmart.UI.hideLoading()
        }
      )
    },
    onSuccess(data) {
      HdSmart.UI.hideLoading()
      if (data.device_id) {
        this.device_id = data.device_id
      }
      if (data.family_id) {
        this.family_id = data.family_id
      }
      this.device_category_id = data.device_category_id
      this.model = data.attribute
      // this.onAlarm(data.attribute);//设备自动发送告警信息
      this.onAlarmError(data.attribute)// 设备自动发送告警信息
    },
    onError() {}
  }
}
</script>

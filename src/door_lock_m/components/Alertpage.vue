<template>
  <alert-page-mobile :title="title" :query-info="queryInfo" @closeItem="closeItem"/>
</template>

<script>
import Vue from 'vue'
import AlertPageMobile from '../../../lib/components/AlertPageMobile'
export default {
  components: {
    AlertPageMobile
  },
  data() {
    return {
      title: '智能门锁告警',
      queryInfo: [],
      localStorageName: ''
    }
  },
  watch: {

  },
  created() {
    this.queryInfo = this.$store.state.errStore.queryInfo || []// 返回的告警信息
    this.localStorageName = this.$store.state.errStore.localStorageName// 告警的localStorage字段名
    console.log(99999, this.title, this.queryInfo, this.localStorageName)
  },
  mounted() {
  },
  destroyed() {

  },
  methods: {
    closeItem(itemClicked) {
      const code = itemClicked.code
      if (code == 'e4') {
        HdSmart.Device.control({// APP主动消除故障命令
          method: 'dm_set',
          nodeid: 'doorlock.main.error',
          params: {
            attribute: {
              error: [
                {
                  code: 'e4',
                  status: itemClicked.status
                }
              ]
            }
          }
        })
      }
      const store = window.localStorage
      const errorsStorage = JSON.parse(store.getItem(this.localStorageName)) || []
      errorsStorage.forEach((item, index) => { // 点击了某一条
        if (item.code === itemClicked.code) {
          item.clicked = true// 已经被点击
          return
        }
      })
      store.setItem(this.localStorageName, JSON.stringify(errorsStorage))// 更新告警信息
      this.queryInfo = errorsStorage.filter((item, index) => {
        return item.clicked === false
      })
      if (this.queryInfo.length <= 0) {
        // IOT-9534
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      }
    }
  }
}
</script>

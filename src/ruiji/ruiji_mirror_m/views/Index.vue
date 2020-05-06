<template>
  <div class="back-container">
    <div class="button-control">
      <type-switch :type="1" :currentIndex.sync="currentIndex" :isActive="true"></type-switch>
<!--      <type-switch :type="0" :currentIndex.sync="currentIndex" :isActive="currentIndex===0"></type-switch>-->
    </div>
<!--    <blood-pressure v-if="currentIndex===0" :bloodData="bloodData"></blood-pressure>-->
    <body-fat v-if="true" :fatData="fatData"></body-fat>
  </div>
</template>

<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import bloodPressure from '@/ruiji/ruiji_mirror_m/components/bloodPressure.vue'
  import bodyFat from '@/ruiji/ruiji_mirror_m/components/bodyFat.vue'
  import typeSwitch from '@/ruiji/ruiji_mirror_m/components/typeSwitch.vue'
  export default {
    components: {
      bodyFat,
      bloodPressure,
      typeSwitch,
    },
    data() {
      return {
        bloodData:[],
        fatData:[],
        currentIndex: 0,
      }
    },

    computed: {
      ...mapGetters(['isClose', 'isOffline']),
      ...mapState(['device', 'deviceAttrs'])
    },
    watch: {
      'device.stateChange'() {
        this.flagVal = false
      }
    },
    created() {
      HdSmart.ready(() => {
        this.getDeviceInfo().then(() => {
          this.itemTemp = this.deviceAttrs.temperature
        })
        // this.requestData('get_dev_status_list', {"type": "blood", "size": 100, "begin": 0}).then(res=>{
        //   // console.log('get_dev_status_list---blood=====', res)
        //   // this.bloodData=res
        // })
        this.requestData('get_dev_status_list', {"type": "bmi", "size": 100, "begin": 0}).then(res=>{
          console.log('get_dev_status_list---bmi=====', res)
          this.fatData=res
        })
        HdSmart.UI.setStatusBarColor(1)
      })
    },
    async mounted() {


    },
    methods: {
      ...mapActions(['getDeviceInfo', 'doControlDevice']),
      requestData(method, param) {
        return new Promise((resolve, reject) => {
          HdSmart.network.httpRequest(method, param, function (response) {
            if (!response.error)  {
              resolve(response.list)
            }else {
              HdSmart.UI.toast('请求错误', 1500)
            }
          })
        })
      },
      switchClick(index) {
        console.log('按钮点击了===', index)
        this.currentIndex = index
      }
    },
  }
</script>
<style lang="less" scoped>
  .back-container {
    font-size: 32px;
    color: white;
    background-color: #19191C;
  }
  .button-control {
    display: flex;
    justify-content: center;
    flex-direction: row;
    background-color: black;
  }
</style>

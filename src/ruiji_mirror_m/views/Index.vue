<template>
  <div class="back-container">
    <div class="button-control">
      <type-switch :type="0" :currentIndex.sync="currentIndex" :isActive="currentIndex===0"></type-switch>
      <type-switch :type="1" :currentIndex.sync="currentIndex" :isActive="currentIndex===1"></type-switch>
    </div>
    <blood-pressure v-if="currentIndex===0" :bloodData="bloodData"></blood-pressure>
    <body-fat v-if="currentIndex===1" :fatData="fatData"></body-fat>
  </div>
</template>

<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import bloodPressure from '@/ruiji_mirror_m/components/bloodPressure.vue'
  import bodyFat from '@/ruiji_mirror_m/components/bodyFat.vue'
  import typeSwitch from '@/ruiji_mirror_m/components/typeSwitch.vue'
  export default {
    components: {
      bodyFat,
      bloodPressure,
      typeSwitch,
    },
    data() {
      return {
        bloodData:[],
        fatData:[{
          attribute: {
            createTime: "2020-04-26 17:02:00",
            value1: "0",
            value10: "0.0",
            value11: "0",
            value2: "0",
            value3: "0",
            value4: "0.0",
            value5: "0.0",
            value6: 0,
            value7: "0.0",
            value8: "0.0",
            value9: "0.0",
          },
          "device_id": 8087252,
          "family_id": 27225,
          "status_modified_at": 1587892191082,
          type: "395318.bmi",
          "updated_at": 1587892191,
        }],
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
        this.requestData('get_dev_status_list', {"type": "blood", "size": 100, "begin": 0}).then(res=>{
          this.bloodData=res
        })
        this.requestData('get_dev_status_list', {"type": "bmi", "size": 100, "begin": 0}).then(res=>{
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
            console.log('get_dev_status_list-httpRequest--response=====', response)
            if (Array.isArray(response))  {
              resolve(response)
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
    flex-direction: row;
    background-color: black;
  }
</style>

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
        bloodData:[{
          attribute: {
            createTime: "2020-04-26 17:02:00",
            value1: "150",
            value10: "0.0",
            value11: "16.3",
            value2: "85",
            value3: "100",
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
        },
          {
            attribute: {
              createTime: "2020-04-26 17:02:00",
              value1: "110",
              value10: "0.0",
              value11: "17.3",
              value2: "88",
              value3: "99",
              value4: "0.0",
              value5: "0.0",
              value6: 0,
              value7: "0.0",
              value8: "0.0",
              value9: "0.0",
            },
            "device_id": 8087252,
            "family_id": 27225,
            "status_modified_at": 1587891986852,
            type: "317888.bmi",
            "updated_at": 1587891986,
          },{
            attribute: {
              createTime: "2020-04-26 17:02:00",
              value1: "110",
              value10: "0.0",
              value11: "17.3",
              value2: "88",
              value3: "99",
              value4: "0.0",
              value5: "0.0",
              value6: 0,
              value7: "0.0",
              value8: "0.0",
              value9: "0.0",
            },
            "device_id": 8087252,
            "family_id": 27225,
            "status_modified_at": 1587891986852,
            type: "317888.bmi",
            "updated_at": 1587891986,
          },{
            attribute: {
              createTime: "2020-04-26 17:02:00",
              value1: "110",
              value10: "0.0",
              value11: "17.3",
              value2: "88",
              value3: "100",
              value4: "0.0",
              value5: "0.0",
              value6: 0,
              value7: "0.0",
              value8: "0.0",
              value9: "0.0",
            },
            "device_id": 8087252,
            "family_id": 27225,
            "status_modified_at": 1587891986852,
            type: "317888.bmi",
            "updated_at": 1587891986,
          },{
            attribute: {
              createTime: "2020-04-26 17:02:00",
              value1: "110",
              value10: "0.0",
              value11: "17.3",
              value2: "78",
              value3: "110",
              value4: "0.0",
              value5: "0.0",
              value6: 0,
              value7: "0.0",
              value8: "0.0",
              value9: "0.0",
            },
            "device_id": 8087252,
            "family_id": 27225,
            "status_modified_at": 1587891986852,
            type: "317888.bmi",
            "updated_at": 1587891986,
          },{
            attribute: {
              createTime: "2020-04-26 17:02:00",
              value1: "110",
              value10: "0.0",
              value11: "17.3",
              value2: "80",
              value3: "125",
              value4: "0.0",
              value5: "0.0",
              value6: 0,
              value7: "0.0",
              value8: "0.0",
              value9: "0.0",
            },
            "device_id": 8087252,
            "family_id": 27225,
            "status_modified_at": 1587891986852,
            type: "317888.bmi",
            "updated_at": 1587891986,
          }
        ],
        fatData:[{
          attribute: {
            createTime: "2020-04-26 17:02:00",
            value1: "150",
            value10: "0.0",
            value11: "16.3",
            value2: "85",
            value3: "100",
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
        },],
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
          // this.bloodData=res
        })
        this.requestData('get_dev_status_list', {"type": "bmi", "size": 100, "begin": 0}).then(res=>{
          // this.fatData=res
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
            console.log('get_dev_status_list-----HdSmart.network.httpRequest--response=====', response)
            resolve(response)
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
    background-color: black;
  }
  .button-control {
    display: flex;
    flex-direction: row;
    background-color: black;
  }
</style>

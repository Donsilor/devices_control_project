<template>
  <div class="wrap">
    <page-on 
      v-if="ac.switchStatus==='on'"
      ref="airon"
      :control="controlDevice"
      :device="device"
      :ac="ac" />
    <page-off 
      v-if="ac.switchStatus==='off'"
      :control="controlDevice"
      :device="device" />
      <!-- <page-error v-if="status==='ERROR'" :reload="init" /> -->
  </div>
</template>

<script>
import PageOn from "./components/PageOn.vue"
import PageOff from "./components/PageOff.vue"
import PageError from "./components/PageError.vue"

const DefaultSpin = require("@lib/base/air_condition/assets/buffering_power_white.gif")
const BlueSpin = require("@lib/base/air_condition/assets/buffering_power_blue.gif")
let tempRadio = 10

export default {
  components: {
    "page-on": PageOn,
    "page-off": PageOff,
    "page-error": PageError
  },
  data() {
    return {
      status: "", //SUCCESS,ERROR
      ac: {
        temperature: '', //[16,30]
        switchStatus: "", //on,off(发送指令为switch)
        mode: "", //auto,cold,heat,dehumidify,wind
        speed: "", //low,normal,high,auto
        wind_up_down: "", //on,off
        wind_left_right: "" //on,off
      },
      device: {}
    }
  },
  created() {
    HdSmart.onDeviceStateChange(res => {
      this.onSuccess(res.result)
    })
    this.init()
  },
  methods: {
    showSpin(ele, style) {
      if (!ele) {
        return
      }
      this.removeSpin()
      this.loadingDelay = setTimeout(() => {
        this.spinner = document.createElement("img")
        this.spinner.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%'
        this.spinner.src = style === "blue" ? BlueSpin : DefaultSpin
        this.loadingEl = ele
        this.loadingEl.appendChild(this.spinner)
      }, 800)
    },
    removeSpin() {
      clearTimeout(this.loadingDelay)
      if (this.spinner) {
        this.loadingEl.removeChild(this.spinner)
        this.spinner = null
      }
    },
    controlDevice(attr, val, target, success, error) {
      if (this.ac[attr] === val) {
        return
      }
      var style = "default"
      if (attr !== "temperature") {
        style = "blue"
      }
      this.showSpin(target, style)
      HdSmart.Device.control(
        {
          method: "dm_set",
          nodeid: `airconditioner.main.${attr}`,
          params: {
            attribute: {
              [attr]:
                attr == "temperature" ? val * tempRadio : val
            }
          }
        },
        res => {
          if (attr == "switch") {
            this.ac.switchStatus = val
          } else {
            this.ac[attr] = val
          }
          this.removeSpin()
          success && success()
        },
        () => {
          this.removeSpin()
          error && error()
        }
      )
    },
    setAttr(attrs) {
      // for(var p in attrs){
      //     this.ac[p==='switch'?'switchStatus':p] = attrs[p]
      // }
      attrs.temperature = attrs.temperature / tempRadio
      this.ac = attrs
    },
    init() {
      HdSmart.ready(() => {
        HdSmart.UI.showLoading()
        if (window.device_name) {
          this.device.name = window.device_name
        }
        this.getSnapShot()
      })
    },
    getSnapShot() {
      HdSmart.Device.getSnapShot(
        res => {
          HdSmart.UI.hideLoading()
          this.onSuccess(res)
        },
        () => {
          HdSmart.UI.hideLoading()
          this.onError()
        }
      )
    },
    onSuccess(data) {
      if (data && data.attribute) {
        if (data.attribute.operation === "abnormal") {
          this.onError()
        } else {
          this.status = "SUCCESS"
          this.setAttr(data.attribute)
          this.$nextTick(() => {
            try {
              this.$refs.airon.syncTemp()
            } catch (e) { }
          })
        }
      }
    },
    onError() {
      this.status = "ERROR"
      this.ac.switchStatus = 'on'
      this.ac.temperature = 0
      this.$nextTick(() => {
        try {
          this.$refs.airon.syncTemp()
        } catch (e) { }
      })
    }
  },
}
</script>

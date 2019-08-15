<template>
  <div class="control-container">
    <div class="box tap-box">
      <div
        v-finger:touch-start="onGo(20)"
        class="tap"
      >20%</div>
      <div
        v-finger:touch-start="onGo(50)"
        class="tap"
      >50%</div>
      <div
        v-finger:touch-start="onGo(80)"
        class="tap"
      >80%</div>
      <div
        v-finger:touch-start="onGo(100)"
        class="tap"
      >100%</div>
    </div>
    <div class="box button-box">
      <div
        v-finger:touch-start="onCloseTouchStart"
        :class="[loading_type=='off' ? 'loading':'normal']"
        class="off button"
      />
      <div
        v-finger:touch-start="onPauseTouchStart"
        :class="[loading_type=='pause' ? 'loading':'normal']"
        class="pause button"
      />
      <div
        v-finger:touch-start="onOpenTouchStart"
        :class="[loading_type=='on' ? 'loading':'normal']"
        class="on button"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    is_ready: Boolean
  },
  data() {
    return {
      loading_type: "",
      timer: null
    }
  },
  methods: {
    stopLoading() {
      this.loading_type = ""
      clearTimeout(this.timer)
    },
    delayLoading(callback) {
      this.timer = setTimeout(() => {
        callback()
      }, 300)
    },
    onOpenTouchStart() {
      if (!this.is_ready) return false
      if (this.loading_type != "on") {
        this.stopLoading()
        this.delayLoading(() => {
          this.loading_type = "on"
        })
        this.$emit("onOpen", () => {
          this.stopLoading()
        })
      }
    },
    onCloseTouchStart() {
      if (!this.is_ready) return false
      if (this.loading_type !== "off") {
        this.stopLoading()
        this.delayLoading(() => {
          this.loading_type = "off"
        })
        this.$emit("onClose", () => {
          this.stopLoading()
        })
      }
    },
    onPauseTouchStart() {
      if (!this.is_ready) return false
      if (this.loading_type !== "pause") {
        this.stopLoading()
        this.delayLoading(() => {
          this.loading_type = "pause"
        })
        this.$emit("onPause", () => {
          this.stopLoading()
        })
      }
    },
    onGo(target_percentage) {
      return () => {
        if (!this.is_ready) return false
        this.stopLoading()
        //this.target_percentage = target_percentage;
        this.$emit("onGoPercentage", target_percentage)
      }
    }
  }
}
</script>

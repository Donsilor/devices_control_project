<template>
  <div />
</template>


<style lang="less">
.noUi-target,
.noUi-target * {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-user-select: none;
  -ms-touch-action: none;
  touch-action: none;
  -ms-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.noUi-target {
  position: relative;
  direction: ltr;
}
.noUi-base,
.noUi-connects {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
/* Wrapper for all connect elements.
 */
.noUi-connects {
  overflow: hidden;
  z-index: 0;
}
.noUi-connect,
.noUi-origin {
  will-change: transform;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
/* Offset direction
 */
html:not([dir="rtl"]) .noUi-horizontal .noUi-origin {
  left: auto;
  right: 0;
}

.noUi-horizontal .noUi-origin {
  height: 0;
}
.noUi-handle {
  position: absolute;
}
.noUi-state-tap .noUi-connect,
.noUi-state-tap .noUi-origin {
  -webkit-transition: transform 0.3s;
  transition: transform 0.3s;
}

/* Handle stripes;
 */
.noUi-handle:before {
  content: "";
  display: block;
  position: absolute;
  height: 60px;
  width: 60px;
  background: #fff;
  left: -10px;
  top: -10px;
  opacity: 0.5;
  border-radius: 100%;
}

.noUi-connects {
  overflow: hidden;
  z-index: 0;
}
.noUi-base,
.noUi-connects {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
.noUi-target {
  background: rgba(0, 0, 0, 0.4);
}
.noUi-handle {
  background: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 100%;
}
.noUi-connect {
  background: #fff;
}
.noUi-horizontal {
  height: 6px;
}
.noUi-horizontal .noUi-handle {
  right: -17px;
  left: auto;
  top: -17px;
  position: absolute;
}
.noUi-target[disabled] {
  opacity: 0.6;
}
</style>


<script>
import noUiSlider from 'nouislider'
// import 'nouislider/distribute/nouislider.css'
export default {
  props: {
    options: {
      type: Object
    },
    value: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  watch: {
    value(val) {
      if (!this.isDraging) {
        this.slider.set(val)
      }
    },
    disabled(val) {
      if (val) {
        this.$el.setAttribute('disabled', true)
      } else {
        this.$el.removeAttribute('disabled')
      }
    }
  },
  mounted() {
    let self = this
    let options = Object.assign({
      start: this.value
    }, this.options)

    noUiSlider.create(this.$el, options)
    this.slider = this.$el.noUiSlider
    this.isDraging = false
    this.setTimer = null
    this.init = false

    if (this.disabled) {
      this.$el.setAttribute('disabled', true)
    }

    this.slider.on('update', function(values, handle) {
      // console.log('update')
      self.$emit('input', parseInt(values[handle]))
      if (self.init) {
        self.isUpdating = true
      }
      self.init = true
    })
    this.slider.on('change', function(values, handle) {
      self.$emit('input', parseInt(values[handle]))
      // console.log('change')
    })
    this.slider.on('slide', function(values, handle) {
      // console.log('slide')
    })
    this.slider.on('set', function(values, handle) {
      // console.log('set')
      clearTimeout(self.setTimer)
      self.setTimer = setTimeout(function() {
        self.isUpdating = false
        self.$emit('change', parseInt(values[handle]))
      }, 500)
    })
    this.slider.on('start', function(values, handle) {
      self.isDraging = true
    })
    this.slider.on('end', function(values, handle) {
      self.isDraging = false
    })

  },
  beforeDestroy() {
    this.$el.noUiSlider.off()
    this.slider = null
  }
}
</script>

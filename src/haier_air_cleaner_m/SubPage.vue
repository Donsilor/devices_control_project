<template>
  <div 
    v-show="visible"
    class="subpage">
    <topbar 
      :title="title"
      :back="close"
      :buttons="[]"
      bak-color="#000" />
    <div class="subpage-body">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.subpage {
  background: #f2f2f2;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 99999;
  .navbar .left a.icon-return {
    border-color: #000;
  }
}
</style>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    className: ""
  },
  data() {
    return {
      visible: this.value
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      this.$emit("on-visible-change", val)
      if (!val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    close() {
      this.visible = false
      this.$emit("input", false)
      this.$emit("on-cancel")
    }
  }
}
</script>

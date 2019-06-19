<template>
  <div
    v-show="visible"
    class="subpage">
    <!-- <div class="topbar">
      <div class="left">
        <a
          class="icon icon-arrow"
          @click="close"/>
      </div>
      <div class="title">{{ title }}</div>
    </div> -->
    <topbar
      :title="title"
      :back="close"
      :buttons="[]"
      bak-color ="#000" />

    <div class="subpage-body">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.subpage {
  background: #fff;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 999;

  color: #fff;
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
            if(!val){
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

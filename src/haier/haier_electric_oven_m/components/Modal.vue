<template>
  <div :class="className">
    <div
      v-show="visible"
      class="overlay"
      @click="overlayClick"/>
    <div
      v-show="visible"
      class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ title }}</div>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="wrap-btns">
        <div
          class="cancel"
          @click="close">取消</div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 638px;
    border-radius: 12px;
    z-index: 99999;
    &-header {
        height: 84px;
        position: relative;
    }
    &-title {
        font-weight: 900;
        margin: 88px 48px 0;
        font-size: 40px;
        color: #20282B;
    }
    &-close {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 84px;
        height: 84px;
        background: url('~@lib/components/assets/btn_close.png') no-repeat center center;
        background-size: 36px 36px;
    }
    &-body {
        padding-bottom: 48px;
        text-align: center;
    }
    .wrap-btns {
      text-align: center;
      padding-bottom: 76px;
    }
    .cancel{
        color: #FFC700;
        font-size: 36px;
        line-height: 44px;
      }
}
.overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99999;
}
.android .modal{
    margin-top: -80px;
}
</style>

<script>
export default {
    props: {
        title: "",
        value: {
            type: Boolean,
            default: false
        },
        className: "",
        overlayClickable: {
            type: Boolean,
            default: true
        },
        showCloseBtn: {
            type: Boolean,
            default: true
        }
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
        }
    },
    methods: {
        close() {
            this.visible = false
            this.$emit("input", false)
            this.$emit("on-cancel")
        },
        overlayClick() {
            if (this.overlayClickable) {
                this.close()
            }
        }
    }
}
</script>

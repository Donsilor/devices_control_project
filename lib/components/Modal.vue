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
        <div 
          v-show="showCloseBtn" 
          class="modal-close" 
          @click="close"/>
      </div>
      <div class="modal-body">
        <slot />
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
    width: 600px;
    border-radius: 6px;
    z-index: 99;
    &-header {
        height: 84px;
        border-bottom: 1px solid #dbdbdb;
        position: relative;
    }
    &-title {
        font-size: 30px;
        color: #76787a;
        text-align: center;
        line-height: 84px;
    }
    &-close {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 84px;
        height: 84px;
        background: url(./assets/btn_close.png) no-repeat center center;
        background-size: 36px 36px;
    }
    &-body {
        padding: 48px 0;
        text-align: center;
    }
}
.overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index:9;
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
        };
    },
    watch: {
        value(val) {
            this.visible = val;
        },
        visible(val) {
            this.$emit("on-visible-change", val);
        }
    },
    methods: {
        close() {
            this.visible = false;
            this.$emit("input", false);
            this.$emit("on-cancel");
        },
        overlayClick() {
            if (this.overlayClickable) {
                this.close();
            }
        }
    }
};
</script>

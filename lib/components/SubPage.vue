<template>
  <div
    v-show="visible"
    class="subpage">
    <div class="topbar">
      <div class="left">
        <a
          class="icon icon-arrow"
          @click="close"/>
      </div>
      <div class="title">{{ title }}</div>
    </div>
    <div class="subpage-body">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.subpage {
    background: #fff;
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
}
.topbar {
    background: #f2f2f2;
    height: 88px;
    border-bottom: 1px solid #dbdbdb;
    position: relative;
    .left {
        position: absolute;
        top: 0;
        left: 0;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
    }
    .title {
        text-align: center;
        line-height: 88px;
        font-size: 36px;
    }
    .icon {
        width: 84px;
        height: 88px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 36px 36px;
        background-position: center center;
    }
    .icon-arrow {
        background-image: url(../base/oven/assets/icn_topbar_back_normal@2x.png);
        &:active {
            background-image: url(../base/oven/assets/icn_topbar_back_pressed@2x.png);
        }
    }
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
        className: ""
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
            if(!val){
                this.$emit('close')
            }
        }
    },
    methods: {
        close() {
            this.visible = false;
            this.$emit("input", false);
            this.$emit("on-cancel");
        }
    }
};
</script>

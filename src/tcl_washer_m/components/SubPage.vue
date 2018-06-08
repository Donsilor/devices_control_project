<template>
    <div class="subpage" v-show="visible">
        <div class="topbar">
            <div class="left">
                <a class="icon icon-arrow" @click="close"></a>
            </div>
            <div class="title">{{title}}</div>
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
    height: 100px;
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
        line-height: 100px;
        font-size: 36px;
    }
    .icon {
        width: 84px;
        height: 100px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 36px 36px;
        background-position: center center;
    }
    .icon-arrow {
        background-image: url(../../../lib/base/washer/assets/icn_topbar_back_normal@2x.png);
        &:active {
            background-image: url(../../../lib/base/washer/assets/icn_topbar_back_pressed@2x.png);
        }
    }
}

@media only screen and (-webkit-min-device-pixel-ratio: 3),
    only screen and (min-device-pixel-ratio: 3) {
    .topbar {
        height: 116px;
        .title {
            line-height: 116px;
        }
        .icon {
            height: 116px;
        }
    }
}

.isIOS .topbar {
    height: 88px;
    .title {
        line-height: 95px;
    }
    .icon {
        height: 88px;
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

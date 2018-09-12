<template>
    <icon class="redact" :onClick="toAppDeviceDetail" />
</template>

<style lang="less">
.redact {
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    background-image: url(./assets/btn_device_setting.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    &-white {
        background-image: url(./assets/btn_device_setting_white.png);
    }
}
</style>

<script>
import Icon from "./Icon.vue";
export default {
    components: {
        Icon
    },
    props: {
        className: {
            type: String,
            default: "redact"
        }
    },
    data() {
        return {};
    },

    methods: {
        toAppDeviceDetail() {
            HdSmart.UI.goDeviceDetail();
        }
    }
};
</script>

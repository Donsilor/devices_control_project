<template>
    <icon class="redact" :onClick="toAppDeviceDetail" />
</template>

<style lang="less">
.redact {
    position: absolute;
    z-index: 8;
    right: 48px;
    bottom: 228px;
    width: 48px;
    height: 48px;
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

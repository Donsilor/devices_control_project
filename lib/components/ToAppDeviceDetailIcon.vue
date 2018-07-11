<template>
    <icon :className="className" :styleObj="{marginLeft: '10px'}" :onClick="toAppDeviceDetail" />
</template>

<style lang="less">
.redact {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(./assets/icn_redact@2x.png) no-repeat;
    background-size: 100% 100%;
}
.redact-white {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(./assets/icn_redact_white@2x.png) no-repeat;
    background-size: 100% 100%;
}
</style>

<script>
import Icon from './Icon.vue';
export default {
    components: {
        Icon
    },
    props: {
        className: {
            type: String,
            default: 'redact'
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

<template>
    <div class="wrap-error" @click="reload()">
        <div class="error-tip">
            <i></i>
            加载失败，请点击屏幕刷新
        </div>
    </div>
</template>

<script>
export default {
    props: {
        reload: {
            type: Function
        }
    }
};
</script>

<style lang="less" scoped>
.wrap-error {
    background: #f2f2f2;
}
.error-tip {
    text-align: center;
    color: #c8cacc;
    font-size: 32px;
    position: absolute;
    left: 0%;
    top: 30%;
    width: 100%;
    i {
        display: block;
        width: 360px;
        height: 360px;
        background: url(../../../lib/base/air_condition/assets/img_disconnection@2x.png)
            no-repeat;
        background-size: 100% 100%;
        margin: 0 auto 36px;
    }
}
</style>

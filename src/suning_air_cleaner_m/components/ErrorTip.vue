<template>
    <div class="page-error">
        <div class="error-tip">
            <img src='../../../lib/base/air_condition/assets/init_err.png' />
            <p>加载失败，请点击屏幕刷新</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
.page-error {
    height: 100%;
    background: #f2f2f2;
    text-align: center;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
.error-tip {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
}
.error-tip p {
    min-height: 30px;
    font-size: 30px;
    margin: 24px 0 110px 0;
    opacity: 1;
    position: relative;
}
</style>


<script>
export default {};
</script>


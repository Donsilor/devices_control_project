<template>
    <div class="wrap">
        <div class="left circle"></div>
        <div class="line"></div>
        <div class="right circle"></div>
    </div>
</template>
<style scoped lang="scss">
    $size:18px;
    $height:12px;
    .wrap {
        width: 1230px;
        position: relative;
    }
    .line{
        opacity: 0.5;
        background: #ffffff;
        height: $height;
    }
    .circle{
        position: absolute;
        background:#ffffff;
        width:$size;
        height:$size;
        border-radius:100%;
        top: -($size - $height)/2;
    }
    .left{
        left: -$size/2
    }
    .right{
        right: -$size/2;
    }
</style>
<script>
    export default {}
</script>
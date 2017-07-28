<template>
    <div class="devider">
        <!--<div class="devider-line"></div>-->
        <!--<span class="devider-content">{{content}}</span>-->
        <!--<div class="devider-line"></div>-->
        <span class="devider-content">{{content}}</span>
    </div>
</template>

<style scoped="">
    .devider {
        line-height: 24px;
        font-size: 24px;
        color: #dbdbdb;
    }
    .devider-line{
        box-shadow: inset 0 -1px 0 0 #dbdbdb;
        width: 144px;
        height: 12px;
        margin-bottom: 6px;
        display: inline-block;
    }
</style>

<script>
    export default{
        props: ['content']
    }
</script>


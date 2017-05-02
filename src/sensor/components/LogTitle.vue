<template>
    <div class="log-title">
        <div class="box">
            <div class="icon"></div>
            <div class="title">{{device.title}}</div>
            <div class="power_status" v-if="device.power_status == 'on'">电量低</div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            device: Object
        }
    }
</script>
<style lang="scss" scoped>
    .log-title{
        background: #f2f2f2;
        width: 100%;
        height: 84px;
        line-height: 84px;
        font-size:30px;
        color:#333333;
        margin-bottom: 36px;
    }
    .box{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .icon{
        content: "";
        background: url('../assets/icn_door_s.png')  no-repeat center center;
        width: 36px;
        height: 36px;
        background-size: 100% 100%;
        margin: 0 12px 0 30px;
    }
    .title{
        flex: 1;
    }
    .status{
        margin-right: 36px;
        font-size: 24px;
        color: #808080;
        position: relative;
        font-weight: normal;
    }
    .status:before{
        content:'';
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        margin: -6px 12px 0 0;
        line-height: 12px;
        border-radius: 12px;
        background: #808080;
    }
    .status.active{
        color: #13d5dc;
    }
    .status.active:before{
        background: #13d5dc;
    }


    .power_status{
        margin-right: 24px;
        font-size: 24px;
        color: #f26161;
        position: relative;
        font-weight: normal;
    }
    .power_status:before{
        content:'';
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        margin: -6px 12px 0 0;
        line-height: 12px;
        border-radius: 12px;
        background: #f26161;
    }
</style>
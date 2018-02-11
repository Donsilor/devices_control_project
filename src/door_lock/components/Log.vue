<template>
<div class="page-log">
    <!-- 顶部条 -->
    <div class="topbar topbar-fixed">
        <div class="left">
            <router-link to="/" class="icon icon-arrow"></router-link>
        </div>
        <div class="title">
            <a href="#">开锁记录</a>
            <a href="#">预警记录</a>
        </div>
        <div class="right">
            <a href="" class="icon icon-del" @click.prevent="clearLog"></a>
        </div>
    </div>

    <log-list :data="list" />

    <a href="" class="btn-cale" @click.prevent="showCalendar"></a>
</div>
</template>

<style lang="less" scoped>
    .page-log{
        padding-top: 96px;
    }
    .topbar{
        background: #f2f2f2;
        height: 95px;
        border-bottom: 1px solid #dbdbdb;
        position: relative;
        .left{
            position: absolute;
            top: 0;
            left: 0;
        }
        .right{
            position: absolute;
            top: 0;
            right: 0;
        }
        .title{
            text-align: center;
            line-height: 95px;
            font-size: 36px;
        }
        .icon{
            width: 100px;
            height: 96px;
            display: inline-block;
            background-repeat: no-repeat;
            background-size: 36px 36px;
            background-position: center center;
        }
        .icon-arrow{
            background-image: url(../assets/icn_topbar_back_normal.png);
            &:active{
                background-image: url(../assets/icn_topbar_back_pressed.png);
            }
        }
        .icon-del{
            background-image: url(../assets/icn_topbar_delete_normal.png);
            &:active{
                background-image: url(../assets/icn_topbar_delete_pressed.png);
            }
        }
    }
    .topbar-fixed{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 2;
    }
    .btn-cale{
        position: fixed;
        right: 60px;
        bottom: 270px;
        width: 96px;
        height: 96px;
        background: url(../assets/btn_calendar_normal.png) no-repeat;
        background-size: 100% 100%;
    }
</style>

<script>
import LogList from './LogList'
export default {
    components: {
        LogList
    },
    data() {
        return {
            list: []
        }
    },
    methods: {
        showCalendar() {

        },
        clearLog() {

        }
    }
}
</script>

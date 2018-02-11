<template>
<div class="page-index">

    <div class="name">{{device_name}}</div>

    <div class="lock" :class="[model.switch]">
        <div class="pic"></div>
        <div class="status">{{model.switch == 'on' ? '已打开' : '已关闭'}}</div>
        <div class="battery" :class="batteryStatus">80%电量</div>
    </div>

    <a href="#" class="btn-unlock" :class="{disable:false}" @click.prevent="showPwdInput">开锁</a>

    <router-link to="log" class="btn-golog">日志</router-link>

    <div class="alert"><i></i>智能门锁电池电量不足，请及时更换电池！</div>

    <password-input />

</div>
</template>

<style lang="less" scoped>
    .name{

    }
    .lock{
        .pic{

        }
        .status{

        }
        .battery{

        }
        &.on{
            .pic{}
        }
    }
    .btn-unlock{
        &.disable{}
    }
    .btn-golog{

    }
    .alert{
        position: fixed;
        left: 0;
        top: 96px;
        background: rgba(0,0,0,.75);
        width: 100%;
        height:84px;
        line-height: 84px;
        text-align: center;
        color:#fff;
        font-size:30px;
        i{
            display: inline-block;
            width: 34px;
            height: 34px;
        }
    }
</style>

<script>

import PasswordInput from './PasswordInput.vue'

export default {
    components: {
        PasswordInput
    },
    data() {
        return {
           device_name: '',
           model: {},

        }
    },
    computed: {
        batteryStatus() {

        }
    },
    methods: {
        showPwdInput() {

        }
    }
}
</script>

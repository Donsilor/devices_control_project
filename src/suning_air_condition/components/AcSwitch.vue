<template>
    <div class="timing-item">
        <span class="timing-desc">{{title}}</span>
        <span :class="{'timing-time':true, 'invisible':!on}" v-finger:tap="spanClick">{{ time }}</span>
        <div :class="{'timing-switch': true, 'timer-on': on}" v-finger:tap="toggle" v-finger:swipe="toggle">
            <div class="timing-switch-circle"></div>
        </div>
    </div>
</template>

<style scoped>
    .timing-item{
        line-height: 84px;
        margin-top: 20px;
    }
    .timing-time{
        min-height: 84px;
    }
    .timing-desc{
        font-size: 24px;
    }
    .timing-desc, .timing-time, .timing-switch{
        display: inline-block;
        vertical-align: middle;
    }
    .timing-time{
        width: 58px;
        padding: 0 36px 0 30px;
    }
    .timing-switch{
        width: 72px;
        height: 48px;
        border-radius: 24px;
        background: #c8cacc;
        /*vertical-align: middle;*/
        position: relative;
        transition: background .5s;
    }
    .timing-switch-circle{
        position: absolute;
        width: 42px;
        height: 42px;
        border-radius: 100%;
        left: 2px;
        top: 3px;
        background: #fff;
        transition: left .5s
    }
    .timing-switch.timer-on{
        background: #46bcff;
    }
    .timer-on .timing-switch-circle{
        left: auto;
        right: 2px;
    }
</style>

<script>
    import Vue from 'vue';
    import AlloyFinger from 'alloyfinger';
    import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';
    Vue.use(AlloyFingerVue, { AlloyFinger });
    export default{
        props:
            {
                title: String,
                time: String,
                on: Boolean
            },
        methods: {
            spanClick: function () {
                this.$emit('change');
            },
            toggle: function () {
                this.$emit('toggle');
            }
        }
    }
</script>

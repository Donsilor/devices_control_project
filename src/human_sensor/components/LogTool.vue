<template>
    <div class="tool">
        <div class="bg" v-if="isCalendarShown" @click="hideCalendar"></div>
        <calendar class="calendar-box" :class="{active:isCalendarShown}" @chooseDate="chooseDate" v-if="is_ready"></calendar>
        <div class="btn-top" v-if="jumpToDate" @click="reset"></div>
        <div class="btn-calendar" @click="showCalendar"></div>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    export default {
        props: {
            is_ready: Boolean
        },
        data (){
            return {
                isCalendarShown: false
            }
        },
        computed: mapState(['jumpToDate', 'source_time']),
        methods: {
            showCalendar (){
                this.isCalendarShown = true;
            },
            hideCalendar(){
                this.isCalendarShown = false;
            },
            reset (){
                this.$store.commit('chooseDate', +new Date(this.source_time * 1000))
            },
            chooseDate (year, month, date){
                this.isCalendarShown = false;
                this.$store.commit('chooseDate', +new Date(year, month, date, 23, 59, 59))
            }
        }
    }
</script>
<style lang="less" scoped>
    .tool {
        position: fixed;
        right: 60px;
        bottom: 240px;
        z-index: 100;
    }

    .btn-top {
        background: url('../assets/btn_backtotop_normal.png') center center no-repeat;
        width: 96px;
        height: 96px;
        background-size: 100% 100%;
        margin-bottom: 36px
    }

    .btn-calendar {
        background: url('../assets/btn_calendar_normal.png') center center no-repeat;
        width: 96px;
        height: 96px;
        background-size: 100% 100%;
    }

    .calendar-box {
        position: absolute;
        left: 100%;
        top: 100%;
        transform: translate3d(-100%, -100%, 0) scale3d(0, 0, 0);
        transform-origin: 100% 100%;
        transition: transform 100ms linear;
    }

    .calendar-box.active {
        transform: translate3d(-100%, -100%, 0) scale3d(1, 1, 1);
        transform-origin: 100% 100%;
    }

    .bg {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
</style>
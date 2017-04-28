<template>
    <div class="tool">
        <div class="bg" v-if="isCalendarShown" @click="hideCalendar"></div>
        <calendar class="calendar-box" :class="{active:isCalendarShown}" :current-date="currentDate"></calendar>
        <div class="btn-top"></div>
        <div class="btn-calendar" @click="showCalendar"></div>
    </div>
</template>
<script>
    export default {
        data (){
            return {
                isCalendarShown: false,
                currentDate: this.$store.state.currentDate
            }
        },
        methods: {
            showCalendar (){
                this.isCalendarShown = true;
            },
            hideCalendar(){
                this.isCalendarShown = false;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .tool {
        position: fixed;
        right: 60px;
        bottom: 84px;
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
        transform: translate3d(-100%, -100%, 0) scale3d(0,0,0);
        transform-origin:100% 100%;
        transition: transform 100ms linear;
    }

    .calendar-box.active {
        transform: translate3d(-100%, -100%, 0) scale3d(1,1,1);
        transform-origin:100% 100%;
    }
    .bg{
        position: fixed;
        left: 0;
        right: 0;
        top:0;
        bottom: 0;
    }
</style>
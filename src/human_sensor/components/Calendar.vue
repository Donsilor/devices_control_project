<template>
    <div class="calendar">
        <div class="calendar-title">
            选择日期
        </div>
        <div class="calendar-body">
            <div class="calendar-row calendar-day">
                <div class="calendar-cell calendar-cell-title">
                    <div class="calendar-cell-content">日</div>
                </div>
                <div class="calendar-cell calendar-cell-title">
                    <div class="calendar-cell-content">一</div>
                </div>
                <div class="calendar-cell calendar-cell-title">
                    <div class="calendar-cell-content">二</div>
                </div>
                <div class="calendar-cell calendar-cell-title">
                    <div class="calendar-cell-content">三</div>
                </div>
                <div class="calendar-cell calendar-cell-title">
                    <div class="calendar-cell-content">四</div>
                </div>
                <div class="calendar-cell calendar-cell-title">
                    <div class="calendar-cell-content">五</div>
                </div>
                <div class="calendar-cell calendar-cell-title">
                    <div class="calendar-cell-content">六</div>
                </div>
            </div>
            <div class="calendar-row calendar-date" v-for="days in dayRows">
                <div class="calendar-cell calendar-cell-date" v-for="day in days">
                    <div class="calendar-cell-content" v-if="day" :class="{active:checkIsCurrentDate(year,month,dayAttr[day].date),enable:daysPermission[dayAttr[day].date]}" @click="chooseDate(year,month,dayAttr[day].date)">
                        {{dayAttr[day].date}}
                    </div>
                </div>
            </div>
        </div>
        <div class="calendar-footer">
            <div class="btn-pre-month" @click="renderPreMonth"></div>
            <div class="current-month">{{year}}年{{month+1}}月</div>
            <div class="btn-next-month" @click="renderLastMonth"></div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.calendar {
    width: 468px;
    height: 648px;
    padding: 0 24px;
    box-shadow: 0 1px 6px 0 rgba(51, 51, 51, 0.2);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
}

.calendar-title {
    height: 84px;
    line-height: 84px;
    font-size: 24px;
    color: #19b9dd;
    box-shadow: inset 0 -1px 0 0 #dbdbdb;
}

.calendar-title:before {
    content: "";
    background: url("../../../lib/base/human_sensor/assets/icn_calender_s.png");
    width: 35px;
    height: 31px;
    background-size: 100% 100%;
    display: inline-block;
    vertical-align: middle;
    margin: -8px 10px 0 10px;
}

.calendar-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
}

.calendar-row {
    display: flex;
    flex-direction: row;
    flex: 1;
}

.calendar-cell {
    flex: 1;
    font-size: 24px;
    display: flex;
    align-content: stretch;
}

.calendar-cell-content {
    border-radius: 100%;
    color: #d2d2d2;
    width: 60px;
    height: 60px;
    line-height: 60px;
    flex: 1;
    text-align: center;
    border: 1px solid transparent;
}

.calendar-cell-content.enable:active {
    background: #ebebeb;
    border: 1px solid #ebebeb !important;
}

.calendar-cell-content.active {
    border: 1px solid #13d5dc;
    color: #13d5dc;
}

.calendar-cell-content.enable {
    color: #808080;
}

.calendar-cell-title {
    color: #d2d2d2;
}

.calendar-footer {
    height: 96px;
    box-shadow: inset 0 1px 0 0 #dbdbdb;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.btn-pre-month {
    background: url("../../../lib/base/human_sensor/assets/btn_calendar_pre_normal.png")
        center center no-repeat;
    width: 48px;
    height: 48px;
    line-height: 48px;
    background-size: 100% 100%;
}

.btn-pre-month:active {
    background-image: url("../../../lib/base/human_sensor/assets/btn_calendar_pre_pressed.png");
}

.current-month {
    flex: 1;
    font-size: 30px;
    color: #808080;
    text-align: center;
}

.btn-next-month {
    background: url("../../../lib/base/human_sensor/assets/btn_calendar_next_normal.png")
        center center no-repeat;
    width: 48px;
    height: 48px;
    line-height: 48px;
    background-size: 100% 100%;
}

.btn-next-month:active {
    background-image: url("../../../lib/base/human_sensor/assets/btn_calendar_next_pressed.png");
}
</style>
<script>
import { mapState } from "vuex";

let constDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export default {
    data() {
        return {
            year: 1970,
            month: 0,
            dayRows: [],
            dayAttr: {},
            daysPermission: {}
        };
    },
    computed: mapState(["ptr_up_time"]),
    mounted() {
        let resetRenderDate = () => {
            this.render(new Date(this.ptr_up_time));
            this.updateEnableDay();
        };
        if (this.ptr_up_time) {
            resetRenderDate();
        } else {
            let subscribe = this.$store.subscribe((mutation, state) => {
                if (mutation.type == "updateDownTime") {
                    resetRenderDate();
                    subscribe();
                }
            });
        }
    },
    methods: {
        updateEnableDay() {
            HdSmart.Device.postRequest(
                "getDeviceMonthHistory",
                {
                    year: this.year,
                    month: this.month + 1
                },
                data => {
                    let has_log_dates = data.has_log;
                    let enableDays = {};
                    has_log_dates.forEach((value, key) => {
                        enableDays[value] = true;
                    });
                    this.daysPermission = enableDays;
                }
            );
        },
        checkIsCurrentDate(year, month, date) {
            if (this.ptr_up_time) {
                let currentTime = new Date(this.ptr_up_time);
                let currentYear = currentTime.getFullYear();
                let currentMonth = currentTime.getMonth();
                let currentDate = currentTime.getDate();
                return (
                    currentYear == year &&
                    currentMonth == month &&
                    currentDate == date
                );
            }
            return false;
        },
        render(date) {
            this.year = date.getFullYear();
            this.month = date.getMonth();
            let currentDays = constDays[this.month];
            if (this.month == 1) {
                if (
                    (this.year % 10 === 0 && this.year % 40 === 0) ||
                    (this.year % 10 !== 0 && this.year % 4 === 0)
                ) {
                    currentDays = 29;
                }
            }
            let dayRows = [];
            let dayAttr = {};
            let beginDateInMonth = new Date(this.year, this.month, 1);
            let beginDayInMonth = beginDateInMonth.getDay();
            let beginDayRow = 0;
            let endDateInMonth = new Date(this.year, this.month, currentDays);
            let endDayInMonth = endDateInMonth.getDay();
            let endDayRow = 0;
            for (let beginDay = 0; beginDay < beginDayInMonth; beginDay++) {
                if (!dayRows[beginDayRow]) {
                    dayRows[beginDayRow] = [];
                }
                dayRows[beginDayRow].push(null);
            }
            for (let day = 1; day <= currentDays; day++) {
                let row = parseInt((beginDayInMonth + day - 1) / 7);
                dayAttr[day] = {
                    year: this.year,
                    month: this.month,
                    date: day,
                    day: (beginDayInMonth + day) % 7,
                    active: false
                };
                if (!dayRows[row]) {
                    dayRows[row] = [];
                }
                dayRows[row].push(day);
                endDayRow = row;
            }
            for (let endDay = endDayInMonth + 1; endDay < 7; endDay++) {
                dayRows[endDayRow].push(null);
            }
            this.dayRows = dayRows;
            this.dayAttr = dayAttr;
        },
        renderPreMonth() {
            this.daysPermission = {};
            this.render(new Date(this.year, this.month - 1));
            this.updateEnableDay();
        },
        renderLastMonth() {
            this.daysPermission = {};
            this.render(new Date(this.year, this.month + 1));
            this.updateEnableDay();
        },
        chooseDate(year, month, date) {
            console.log(!this.checkIsCurrentDate(year, month, date));
            if (
                this.daysPermission[this.dayAttr[date].date] &&
                !this.checkIsCurrentDate(year, month, date)
            ) {
                this.$emit("chooseDate", year, month, date);
            }
        }
    }
};
</script>
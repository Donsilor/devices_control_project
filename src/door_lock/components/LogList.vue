<template>
    <div class="door-log">
        <template v-if="data.length">
            <span class="which-day">{{dayText}}</span>
            <ul>
                <li v-for="(item,index) in data" :key="index">
                    <span class="line"></span>
                    <span class="dot"></span>
                    <span class="date">{{formatDate(item.updated_at)}}</span>
                    <span class="log">
                        <i v-if="item.isOpen" :class="`log-icon-${item.attribute.open_type}`"> </i>{{item.log}}</span>
                </li>
            </ul>
        </template>
        <div class="nodata" v-else>
            <span></span> {{dayText}}暂无记录
        </div>
    </div>
</template>

<script>
function fillz(num) {
    num = num + "";
    return num.length == 1 ? "0" + num : num;
}

function getDateStr(date) {
    return (
        date.getFullYear() +
        "-" +
        fillz(1 + date.getMonth()) +
        "-" +
        fillz(date.getDate())
    );
}

export default {
    props: ["data", "currentDate"],
    data() {
        return {
            loadState: ""
        };
    },
    computed: {
        dayText() {
            var inputDate = getDateStr(this.currentDate);
            var now = getDateStr(new Date());
            return inputDate == now ? "今日" : inputDate;
        }
    },
    methods: {
        formatDate(timestamp) {
            var date = new Date(timestamp * 1000);
            return fillz(date.getHours()) + ":" + fillz(date.getMinutes());
        }
    },
    created() {
        //   alert(this.data)
    }
};
</script>
<style lang="less" scoped>
.door-log {
    position: relative;

    .which-day {
        position: absolute;
        font-size: 30px;
        color: #2f3133;
        letter-spacing: 0;
        text-align: right;
        z-index: 10;
        top: 28px;
        left: 490px;
        width: 230px;
        padding-right: 30px;
        box-sizing: border-box;
    }

    li {
        line-height: 96px;
        padding-left: 744px;
        position: relative;
        list-style: none;

        .line {
            background: #f2f2f2;
            width: 2px;
            height: 96px;
            position: absolute;
            left: 718px;
        }

        .dot {
            background: #13d5dc;
            width: 12px;
            height: 12px;
            border-radius: 100%;
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 714px;
            margin-top: -6px;
        }

        .date {
            font-size: 30px;
            color: #2f3133;
            letter-spacing: 0;
            text-align: left;
            display: inline-block;
            margin-right: 48px;
        }

        .log {
            font-size: 30px;
            color: #76787a;
            letter-spacing: 0;
            text-align: left;
            i {
                display: inline-block;
                width: 36px;
                height: 36px;
                margin: 0 24px 0 0px;
                line-height: 36px;
                vertical-align: -7px;
            }
        }
    }
}
.nodata {
    font-size: 30px;
    color: #c8cacc;
    text-align: center;
    span {
        background: url(../../../lib/base/door_lock/assets/img_emptydata.png)
            no-repeat;
        background-size: 100% 100%;
        display: block;
        width: 360px;
        height: 360px;
        margin: 250px auto 36px;
    }
}

.door-log li:first-child .line {
    height: 48px;
    bottom: 0;
}

.door-log li:last-child .line {
    height: 48px;
    top: 0;
}

.door-log li:nth-child(odd) {
    background: #fafafa;
}

/*
    日志图标
*/
.log-icon-17 {
    background: url("../../../lib/base/door_lock/assets/code.png");
    background-size: 100% 100%;
}

.log-icon-18 {
    background: url("../../../lib/base/door_lock/assets/fingerprint.png");
    background-size: 100% 100%;
}

.log-icon-19 {
    background: url("../../../lib/base/door_lock/assets/card.png");
    background-size: 100% 100%;
}

.log-icon-20 {
    background: url("../../../lib/base/door_lock/assets/key.png");
    background-size: 100% 100%;
}
.log-icon-21 {
    background: url("../../../lib/base/door_lock/assets/phone.png");
    background-size: 100% 100%;
}
</style>

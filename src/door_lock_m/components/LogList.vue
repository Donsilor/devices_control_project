<template>
    <div class="door-log">
        <!--<div class="log-block">
            <p class="which-day">208-12-05</p>
            <ul>
                <li>
                    <span class="dot"></span>
                    <span class="date">14:39</span>
                    <span class="log">电池电量低于10%，请及时更换电池</span>
                </li>
                <li>
                    <span class="dot"></span>
                    <span class="date">14:39</span>
                    <span class="log">门未关紧</span>
                </li>
                <li>
                    <span class="dot"></span>
                    <span class="date">14:39</span>
                    <span class="log">门未关紧</span>
                </li>
            </ul>
            <p class="which-day">208-12-05</p>
            <ul>
                <li>
                    <span class="dot"></span>
                    <span class="date">14:39</span>
                    <span class="log">电池电量低于10%，请及时更换电池</span>
                </li>
                <li>
                    <span class="dot"></span>
                    <span class="date">14:39</span>
                    <span class="log">门未关紧</span>
                </li>
                <li>
                    <span class="dot"></span>
                    <span class="date">14:39</span>
                    <span class="log">门未关紧</span>
                </li>
            </ul>
        </div>-->
        <template v-if="data.length">
            <div class="log-block" v-for="row in dataArray" :key="row.dayText">
                <span class="which-day">{{row.dayText}}</span>
                <ul>
                    <li v-for="item in row.data" :key="item.updated_at">
                        <span class="dot"></span>
                        <span class="date">{{formatDate(item.updated_at)}}</span>
                        <span class="log">
                            <i v-if="item.isOpen" :class="`log-icon-${item.attribute.open_type}`"> </i>{{item.log}}</span>
                    </li>
                </ul>
            </div>
        </template>
        <div class="nodata" v-else>
            <span></span>
            <!--{{dayText}}-->
            <p>暂无记录</p>
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
        return {};
    },
    computed: {
        dayText() {
            return this.getDayText(this.currentDate);
        },
        dataArray() {
            var temp = [];
            var day = "";
            var index = 0;
            this.data.forEach(item => {
                var current = this.getDayText(new Date(item.updated_at * 1000));
                if (current != day) {
                    day = current;
                    index = temp.length;
                    temp[index] = {
                        dayText: current,
                        data: []
                    };
                }
                temp[index].data.push(item);
            });
            return temp;
        }
    },
    methods: {
        getDayText(date) {
            var inputDate = getDateStr(date);
            var now = getDateStr(new Date());
            return inputDate == now ? "今日" : inputDate;
        },
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

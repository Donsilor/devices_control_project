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

<template>
    <div class="door-log">
        <template v-if="data.length">
            <span class="which-day">{{dayText}}</span>
            <ul>
                <li v-for="(item,index) in data" :key="index">
                    <span class="line"></span>
                    <span class="dot"></span>
                    <span class="date">{{formatDate(item.updated_at)}}</span>
                    <span class="log">{{item.attribute.user_identify}} 通过{{getOpenType(item.attribute.open_type)}}</span>
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
    num = num + ''
    return num.length == 1 ? '0' + num : num
}

function getDateStr(date) {
    return date.getFullYear() + '-' + fillz(1+date.getMonth()) + '-' + fillz(date.getDate())
}

export default {
  props: ["data",'currentDate'],
  data() {
    return {};
  },
  computed: {
      dayText() {
          var inputDate = getDateStr(this.currentDate)
          var now = getDateStr(new Date)
          return inputDate == now ? '今日' : inputDate
      }
  },
  methods:{
      formatDate(timestamp) {
        var date = new Date(timestamp*1000)
        return fillz(date.getHours()) + ':' + fillz(date.getMinutes())
    },
    getOpenType(type) {
        return {
            '17': '密码开锁',
            '18': '指纹开锁',
            '19': 'IC卡开锁',
            '20': '钥匙开门',
            '21': '手机App开锁'
        }[type]
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
    font-size: 30px;
    line-height: 96px;
    padding-left: 50px;
    color: #2f3133;
    box-sizing: border-box;
  }

  li {
    position: relative;
    list-style: none;
    padding-left: 90px;
    height: 96px;
    line-height: 96px;

    .line {
      background: #f2f2f2;
      width: 2px;
      height: 96px;
      position: absolute;
      left: 58px;
    }

    .dot {
      background: #13d5dc;
      width: 12px;
      height: 12px;
      border-radius: 100%;
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 54px;
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
    }
  }
}
.nodata {
  font-size: 30px;
  color: #c8cacc;
  text-align: center;
  span {
    background: url(../assets/img_emptydata.png) no-repeat;
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
</style>

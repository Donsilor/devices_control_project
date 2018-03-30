<template>
    <div class="door-log">
        <template v-if="data.length">
            <span class="which-day">今天</span>
            <ul>
                <li v-for="(item,index) in data" :key="index" v-if="item.attribute.switch=='on'">
                    <span class="line"></span>
                    <span class="dot"></span>
                    <span class="date">{{formatDate(item.updated_at)}}</span>
                    <span class="log">{{item.attribute.user_identify}} 通过{{getOpenType(item.attribute.open_type)}}</span>
                </li>
            </ul>
        </template>
        <div class="nodata" v-else>
            <span></span>
            本日暂无记录
        </div>
    </div>
</template>

<script>

/**
 {
  "attribute": {
    "switch": "off",
    "switch_open_cnt": 0,
    "switch_close_cnt": 0,
    "user_identify": 255,
    "open_type": 19,
    "battery_percentage": 80,
    "is_user_operate": 1,
    "alarm_state": 0,
    "error": [

    ],
    "connectivity": "online"
  },
  "updated_at": 1522394609
}
 */

function fillz(num) {
    num = num + ''
    return num.length == 1 ? '0' + num : num
}


export default {
  props: ["data"],
  data() {
    return {
    };
  },
  methods:{
      formatDate(timestamp) {
        var date = new Date(timestamp*1000)
        return fillz(date.getHours()) + ':' + fillz(date.getMinutes())
        // date.getFullYear() + '-'
        // + fillz(1+date.getMonth()) + '-'
        // + fillz(date.getDate()) + ' '
        // + fillz(date.getHours()) + ':'
        // + fillz(date.getMinutes()) + ':'
        // + fillz(date.getSeconds())
    },
    getOpenType(type) {
        return {
            '17': '密码开锁',
            '18': '指纹开锁',
            '19': 'IC卡开锁',
            '20': '钥匙开门',
            '21': 'zigbee无线开锁'
        }[type]
    }
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

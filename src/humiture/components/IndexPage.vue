<template>
  <div class="page index">
    <wave :bg_index="status_index" :bg_color="bg_color" class="bg-wave"></wave>
    <div class="content">
      <div class="status">
        <div class="main">{{text}}</div>
        <div class="hint"><img src="../../../lib/base/humiture/assets/bell.png" />{{hint}}</div>
      </div>

      <time>{{time}}</time>

      <div class="bottom">
        <div class="mod">
          <span class="tit">室内温度</span>
          <span class="val">{{temp | formatter}}</span>
          <span class="unit">°C</span>
          <img class="arr" src="../../../lib/base/humiture/assets/arrow.png" />
        </div>
        <div class="mod">
          <span class="tit">室内湿度</span>
          <span class="val">{{humidity | formatter}}</span>
          <span class="unit">%</span>
          <img class="arr" src="../../../lib/base/humiture/assets/arrow.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.index {
    width: 1920px;
    height: 1200px;
    position: relative;
    left: 0;
    top: 0;
}
.bg-wave {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
.content {
    /*position: absolute;*/
    /*height : 100%; width : 100%;*/
    opacity: 0.99;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
}
.main {
    font-family: NotoSansHans-Medium;
    font-size: 72px;
    margin-bottom: 33px;
}
.hint {
    font-family: NotoSansHans-Regular;
    font-size: 30px;
    margin-bottom: 60px;
}
.hint img {
    /*display: inline-block;*/
    width: 32px;
    height: 32px;
    margin-right: 15px;
}
time {
    font-family: RobotoCondensed-Regular;
    font-size: 60px;
    line-height: 60px;

    margin-bottom: 240px;
    display: block;
}
.tit {
    font-family: NotoSansHans-Medium;
    opacity: 0.5;
    font-size: 30px;
    margin-right: 36px;
}
.val {
    font-family: RobotoCondensed-Light;
    font-size: 108px;
    line-height: 108px;
    margin-right: 8px;
}
.unit {
    font-family: NotoSansHans-Regular;
    font-size: 42px;
    line-height: 42px;
    margin-right: 12px;
}
.arr {
    opacity: 0.5;
    width: 18px;
    height: 32px;
}

.bottom {
    display: flex;
}
.mod {
    margin: 0 200px 0 200px;
}
</style>

<script>
import status_config from "../config/status-desc";
import { $find, $interval, $time_format, $tap } from "../utils";

export default {
    name: "index-page",
    props: {
        //温度，单位：°
        temp: Number,
        //湿度，单位：%
        humidity: Number
    },
    data() {
        return {
            //状态
            text: "-",
            //辅助提示
            hint: "--",
            //序号
            status_index: "1-1",
            //背景颜色
            bg_color: "#a7efbd",
            //实时的时间
            time: ""
        };
    },
    filters: {
        //温湿度的计算规则刚好一致，可以共用一个filter.
        formatter(val) {
            return (val / 100).toFixed(1);
        }
    },
    watch: {
        temp() {
            this.update(this.temp, this.humidity);
        },
        humidity() {
            this.update(this.temp, this.humidity);
        }
    },
    methods: {
        update(t, h) {
            //为了和显示值保持一致，这里采取和上面的filter同样的算法
            t = (t / 100).toFixed(1) * 1;
            h = (h / 100).toFixed(1) * 1;

            let status = get_status(t, h);
            //      console.info('status:::', t, h, status);
            if (!status) {
                return false;
            }
            this.text = status.text;
            this.hint = status.hint;
            this.status_index = status.index;
            this.bg_color = status.bg_color;
        }
    },
    mounted() {
        this.update(this.temp, this.humidity);
        //初始化时间
        let refresh_time = () => {
            this.time = $time_format(Date.now(), "hh:mm");
        };
        refresh_time();
        //只需要显示分钟，所以间隔时间在半分钟比较合适
        $interval(30 * 1000).then(refresh_time);

        //两边的两个区域分别响应事件
        [].forEach.call(this.$el.querySelectorAll(".mod"), el => {
            $tap(el, () => {
                //jump2detail事件注册在App.vue中。
                this.$emit("jump2detail");
            });
        });
    }
};

/**
 * t:温度(摄氏度), h:湿度(百分比)
 */
let get_status = (temp, hum) => {
    let result = null;
    //先找到匹配温度区间，再找到匹配的湿度区间
    $find(status_config, (i, index_i) => {
        let t_low = i.temp_range[0],
            t_top = i.temp_range[1],
            humidity = i.humidity;

        //TODO:温湿度区间值都是左开右闭，但是有个例外就是起始值是闭区间:
        // 温度区间:[-20, 18] (18, 27] (27, 60]
        // 湿度区间:[0, 30] (30, 80] (80, 100]
        if (
            (index_i === 0 && temp === t_low) ||
            (t_low < temp && temp <= t_top)
        ) {
            $find(humidity, (j, index_j) => {
                let h_low = j.range[0],
                    h_top = j.range[1];
                //TODO:规则同温度，第一个值特殊化为闭区间。
                if (
                    (index_j === 0 && hum === h_low) ||
                    (h_low < hum && hum <= h_top)
                ) {
                    result = {
                        index: j.index,
                        text: j.text,
                        hint: j.hint,
                        bg_color: j.bg_color
                    };
                }
            });
        }
    });
    return result;
};
</script>



<template>
    <transition name="fade">

            <div class="com-calendar-box" v-if="show">
                <div class="com-mark"  @touchmove.prevent="stop" @click="close"  v-if="show"></div>
                <div class="com-calendar"   >
                    <div class="cal-header">
                        <div class=" dp-left "  @click="close">取消</div>
                        <div class=" dp-right " @click="chose">确定</div>
                    </div>
                    <div class="cal-content"  >
                        <picker :defaultVal.sync=curYear  @changeCurVal=changeCurVal :dataList = year type="year"></picker>
                        <picker :defaultVal.sync=curMonth @changeCurVal=changeCurVal :dataList = month type="month"></picker>
                        <picker :defaultVal.sync=curDay @changeCurVal=changeCurVal :dataList = day type="day"></picker>
                    </div>

                </div>
            </div>

    </transition>

</template>


<script>
import picker from "./picker.vue";
export default {
  data() {
    return {
      show: true,
      year: [1951, 2050],
      month: [1, 12],
      day: [1, 31],
      curYear: 1959,
      curMonth: 1,
      endTime: "",
      date: "",
      curDay: 1,
      onOk: e => {
        console.log(this.curYear + "-" + this.curMonth + "-" + this.curDay);
      },
      onCancel: () => {
        console.log("close");
      }
    };
  },
  created() {
    if (this.endTime) {
      let d = this.endTime.split("-");
      //在限制的时间范围内
      if (d[0] <= this.year[1] && d[0] >= this.year[0]) {
        this.year = [this.year[0], d[0]];
      }
    }
  },
  computed: {
    isR() {
      let isR = this.curYear % 4 == 0 ? true : false;
      console.log(this.curYear % 4);
      return isR;
    }
  },
  watch: {
    //月份变化的时候 检查下是否有endtime的限制
    curMonth() {
      this.checkEndTime();
    },
    //初始化的值要判断下日期的范围
    date() {
      this.changeCurVal("year", this.curYear);
      this.changeCurVal("month", this.curMonth);
    }
  },
  components: {
    picker
  },
  methods: {
    stop(e) {
      e.preventDefault();
    },
    close() {
      this.$calendar.hide();
      this.onCancel();
    },
    chose() {
      this.$calendar.hide();
      let d = this.curYear + "-" + this.curMonth + "-" + this.curDay;
      this.date = this.curYear + "-" + this.curMonth + "-" + this.curDay;
      this.onOk(d);
    },
    checkEndTime() {
      if (this.endTime) {
        let d = this.endTime.split("-");
        //在限制的时间范围内
        if (d[0] <= this.year[1] && d[0] >= this.year[0]) {
          this.year = [this.year[0], d[0]];
          if (this.curYear == this.year[1]) {
            this.month = [1, d[1]];
            if (this.curMonth == d[1]) {
              this.day = [1, d[2]];
            }
          } else {
            this.month = [1, 12];
          }
        } else {
          this.endTime = "";
        }
      }
    },
    changeDataList() {
      let c2 = this.curMonth == 2;
      let c1 = [1, 3, 5, 7, 8, 10, 12].join().indexOf(this.curMonth);
      if (c2) {
        if (this.isR) {
          this.day = [1, 29];
        } else {
          this.day = [1, 28];
        }
      } else if (c1 < 0) {
        this.day = [1, 30];
      } else {
        this.day = [1, 31];
      }
      this.checkEndTime();
    },
    changeCurVal(type, val) {
      if (type == "year") {
        this.curYear = val;
        this.changeDataList();
      }
      if (type == "day") {
        this.curDay = val;
      }
      if (type == "month") {
        this.curMonth = val;
        this.changeDataList();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
  -webkit-transition: opacity 0.3s;
  opacity: 1;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#app {
  position: relative;
  z-index: 1;
}
.com-mark {
  z-index: 998;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  -webkit-transition: opacity 0.2s ease-in;
  transition: opacity 0.2s ease-in;
  background-color: #000;
}
.com-calendar-box {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
}
.com-calendar {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  background: #fff;
  .scroller-component {
    display: block;
    flex: 1;
    position: relative;
    height: 238px;
    overflow: hidden;
    width: 100%;
  }
  .scroller-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: -1;
  }

  .scroller-mask {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    margin: 0 auto;
    width: 100%;
    z-index: 3;
    background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.95),
        rgba(255, 255, 255, 0.6)
      ),
      linear-gradient(
        to top,
        rgba(255, 255, 255, 0.95),
        rgba(255, 255, 255, 0.6)
      );
    background-position: top, bottom;
    background-size: 100% 102px;
    background-repeat: no-repeat;
  }
  .cal-header {
    position: relative;
    width: 100%;
    left: 0;
    height: 45px;
    bottom: 0;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    & > div {
      height: 45px;
      line-height: 45px;
      color: #666;
      width: 60px;
      text-align: center;
      font-size: 16px;
    }
    .dp-right {
      color: #337ab7;
    }
  }
  .cal-content {
    position: relative;
    display: flex;
  }
  .scroller-item {
    text-align: center;
    font-size: 18px;
    height: 34px;
    line-height: 34px;
    color: #000;
  }
  .scroller-indicator {
    width: 100%;
    height: 34px;
    position: absolute;
    left: 0;
    top: 102px;
    z-index: 2;
    background-image: linear-gradient(
        to bottom,
        #d0d0d0,
        #d0d0d0,
        transparent,
        transparent
      ),
      linear-gradient(to top, #d0d0d0, #d0d0d0, transparent, transparent);
    background-position: top, bottom;
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .dp-container {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 10000;
    background-color: #fff;
    transition: transform 0.3s ease;
    transform: translateY(0);
  }
  .dp-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    opacity: 0;
    transition: opacity 0.1s ease;
    background-color: #000;
    z-index: 9999;
  }
  .dp-header {
    display: flex;
    width: 100%;
    box-align: center;
    align-items: center;
    background-image: linear-gradient(
      to bottom,
      #e7e7e7,
      #e7e7e7,
      transparent,
      transparent
    );
    background-position: bottom;
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .dp-header .dp-item {
    color: #666;
    font-size: 18px;
    height: 44px;
    line-height: 44px;
    cursor: pointer;
  }
  .dp-content {
    display: flex;
    width: 100%;
    box-align: center;
    align-items: center;
    padding: 10px 0;
  }
  .dp-header .dp-item,
  .dp-content .dp-item {
    box-sizing: border-box;
    flex: 1;
    text-align: center;
  }
}

.g-calender-content {
  position: absolute;
  bottom: 0;
  z-index: 1000;
}

.com-mark {
  background-color: #000;
  opacity: 0.5;
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;
  z-index: 999;
}
</style>

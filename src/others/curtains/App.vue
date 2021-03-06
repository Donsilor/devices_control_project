<template>
  <div id="app">
    <icon class="redact-white" />
    <div class="device_name">{{ device_name }}</div>
    <div
      v-if="show && tip"
      class="tip"
    >{{ tip }}</div>
    <navigator
      v-once
      class="navigator"
    />
    <curtain
      :is_ready="is_ready"
      class="curtain"
      :open_percentage="target_percentage"
    />
    <control
      class="control"
      @onOpen="onOpen"
      @onPause="onPause"
      @onClose="onClose"
      :is_ready="is_ready"
      @onGoPercentage="onGoPercentage"
    />
  </div>
</template>

<script>
import watermark from "../../lib/watermark";
import Icon from "../../lib/components/SettingIcon.vue";

// const [METHOD, CMD_SWITCH, CMD_RANGE] = ['dm_set_zigbee_curtain', 'setOnoff', 'setLevel'];
const [METHOD, CMD_SWITCH, CMD_RANGE] = ["dm_set", "setOnoff", "setLevel"];

export default {
  name: "app",
  components: {
    Icon
  },
  data() {
    return {
      //用于确定数据是否加载完成，加载完成后渲染动态的UI
      is_ready: false,
      //当前窗帘打开的幅度，请注意,硬件不修改属性依旧使用close_percentage
      open_percentage: 0,
      //目标幅度，用于动画
      target_percentage: 0,
      //点击中部到指定幅度按钮显示的信息
      tip: "",
      //帧数动画id，用于取消
      raf_id: 0,
      //每帧运动的百分比
      raf_percent: 1,
      //每帧间隔时间
      raf_time: 20, //85
      //提示显示
      timer: null,
      //是否显示中部按钮提示
      show: false,
      //临时处理窗帘变动没有上传的问题
      cbFunc: null,
      device_name: ""
    };
  },
  mounted() {
    HdSmart.ready(() => {
      if (window.device_name) {
        this.device_name = window.device_name;
      }
      if (window.user_name && window.phone) {
        watermark({ el: "#app" });
        // this.raf_time = 150
      }
      //获取快照
      HdSmart.Device.getSnapShot(
        data => {
          HdSmart.UI.hideLoading();
          this.is_ready = true;
          if (data && data.attribute) {
            this.open_percentage = data.attribute.open_percentage;
            this.animateToTargetPercentage(this.open_percentage, true);
          }
        },
        () => {
          this.is_ready = true;
          HdSmart.UI.hideLoading();
        }
      );
    });

    var isFirstLoad = true;

    HdSmart.onDeviceStateChange(data => {
      if (this.cbFunc) {
        //等硬件修复了需要干掉
        this.cbFunc();
        this.cbFunc = null;
      }
      try {
        this.animateToTargetPercentage(data.result.attribute.open_percentage, isFirstLoad);
        isFirstLoad = false;
      } catch (error) { }
    });
  },
  methods: {
    animateToTargetPercentage(percent, quite) {
      //初次上电会导致返回报错
      if (percent === 255) {
        return false;
      }
      window.cancelAnimationFrame(this.raf_id);
      if (quite) {
        this.open_percentage = percent;
        this.target_percentage = percent;
      } else {
        if (this.target_percentage != this.open_percentage) {
          // this.target_percentage = this.open_percentage
        }
        this.open_percentage = percent;
        this.raf_percent = Math.abs(this.open_percentage - this.target_percentage) / 600 * this.raf_time;
        var start = Date.now();
        let rafFunc = () => {
          //下一帧数的幅度
          let nextTargetPercentage = this.target_percentage;
          //当前的方向
          let direction = "";
          //当前幅度小于预计移动的幅度，说明正在关闭
          var end = Date.now();
          var p = (end - start) / this.raf_time;
          if (p == 0) p = 1;
          start = end;
          if (nextTargetPercentage > percent) {
            nextTargetPercentage -= this.raf_percent * p;
            direction = "close";
          } else if (nextTargetPercentage < percent) {
            nextTargetPercentage += this.raf_percent * p;
            direction = "open";
          }
          if (direction === "close" && nextTargetPercentage < percent) {
            nextTargetPercentage = percent;
          } else if (direction === "open" && nextTargetPercentage > percent) {
            nextTargetPercentage = percent;
          }

          if (nextTargetPercentage === percent) {
            this.target_percentage = nextTargetPercentage;
            window.cancelAnimationFrame(this.raf_id);
            return false;
          } else if (nextTargetPercentage <= 0) {
            this.target_percentage = 0;
            window.cancelAnimationFrame(this.raf_id);
            return false;
          } else if (nextTargetPercentage >= 100) {
            this.target_percentage = 100;
            window.cancelAnimationFrame(this.raf_id);
            return false;
          }
          this.target_percentage = nextTargetPercentage;
          this.raf_id = window.requestAnimationFrame(rafFunc);
        };
        this.raf_id = requestAnimationFrame(rafFunc);
      }
    },
    onOpen(onFinishCallback) {
      this.clearTargetTip();
      //等硬件修复了需要干掉
      this.cbFunc = onFinishCallback;

      HdSmart.Device.control(
        {
          method: METHOD,
          nodeid: "curtain.main.switch",
          params: {
            attribute: {
              switch: "on"
            }
          }
        },
        data => {
          onFinishCallback();
        },
        () => {
          onFinishCallback();
        }
      );
    },

    onClose(onFinishCallback) {
      this.clearTargetTip();
      //等硬件修复了需要干掉
      this.cbFunc = onFinishCallback;

      HdSmart.Device.control(
        {
          method: METHOD,
          nodeid: "curtain.main.switch",
          params: {
            attribute: {
              switch: "off"
            }
          }
        },
        data => {
          onFinishCallback();
        },
        () => {
          onFinishCallback();
        }
      );
    },
    onPause(onFinishCallback) {
      //等硬件修复了需要干掉
      this.cbFunc = onFinishCallback;

      HdSmart.Device.control(
        {
          method: METHOD,
          nodeid: "curtain.main.switch",
          params: {
            attribute: {
              switch: "pause"
            }
          }
        },
        data => {
          onFinishCallback();
        },
        () => {
          onFinishCallback();
        }
      );
    },
    onGoPercentage(percentage) {
      clearTimeout(this.timer);
      this.tip = `幅度调至${percentage}%`;
      this.show = true;

      this.timer = setTimeout(() => {
        this.show = false;
      }, 2000);

      HdSmart.Device.control(
        {
          method: METHOD,
          nodeid: "curtain.main.open_percentage",
          params: {
            attribute: {
              open_percentage: percentage
            }
          }
        },
        () => { },
        () => { }
      );
    },
    clearTargetTip() {
      this.show = false;
    }
  }
};
</script>

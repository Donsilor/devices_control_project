<template>
  <div
    :class="[ac.mode]"
    class="wrap-on">
    <div class="topbar topbar-fixed">
      <div class="left">
        <a
          href="#/"
          class="icon-return"
          @click.prevent="back"/>
      </div>
      <div class="title">{{ device.name }}</div>
      <div class="right">
        <a
          href=""
          class="icon-more"
          @click.prevent="goDetail"/>
      </div>

    </div>

    <div class="bg"/>

    <div class="header">
      <!--<p class="name">{{device.name}}
                <icon class="redact-white" />
            </p>-->
      <p class="status">
        {{ modeText }} {{ speedText }} {{ ac.env_temperature ? '环境温度' + ac.env_temperature/10 + '℃' : '' }}
      </p>
    </div>

    <div class="current_temp">
      <template v-if="temperature">
        <span class="num">{{ temperature }}</span>
        <span class="unit">℃</span>
      </template>
      <template v-else>
        <span class="line"/>
        <span class="line"/>
      </template>
    </div>

    <transition name="fade">
      <div
        v-show="tipVisible"
        class="tip">{{ tip }}</div>
    </transition>

    <a
      :class="{disabled:ac.mode=='wind'||ac.mode=='auto'||ac.mode=='dehumidify'}"
      href="#"
      class="btn-minus icon-less"
      @click.prevent="setTemperature(-1, $event)"/>
    <a
      :class="{disabled:ac.mode=='wind'||ac.mode=='auto'||ac.mode=='dehumidify'}"
      href="#"
      class="btn-add icon-plus"
      @click.prevent="setTemperature(1, $event)"/>

    <a
      :class="{'btn-toggle-more':toggle}"
      href="#modal"
      class="btn-toggle"
      @click="showMore()"/>

    <div class="btns-hold">
      <ul class="btns">
        <li>
          <a
            href="#modal"
            class="btn-mode icon-mode"
            @click="modeDialogShow=true"/>
          模式
        </li>
        <li>
          <!--<a href="#" class="btn-mode" @click.prevent="modeDialogShow=true"></a>-->
          <a
            href="#"
            class="btn-off icon-switch"
            @click.prevent="setOff($event)"/>
          关闭
        </li>
        <li>
          <a
            href="#modal"
            class="btn-speed2 icon-speed"
            @click="speedDialogShow=true"/>
          风速
        </li>
      </ul>
      <!-- <ul class="btns">
                <li :class="{on:ac.mode==='cold'}">
                    <a href="#" class="btn-cold" :class="{on:ac.mode==='cold'}" @click.prevent="setMode('cold', $event)"></a>
                    制冷
                </li>
                <li :class="{on:ac.mode==='heat'}">
                    <a href="#" class="btn-heat" :class="{on:ac.mode==='heat'}" @click.prevent="setMode('heat', $event)"></a>
                    制热
                </li>
                <li :class="{on:ac.mode==='dehumidify'}">
                    <a href="#" class="btn-dehumidify" :class="{on:ac.mode==='dehumidify'}" @click.prevent="setMode('dehumidify', $event)"></a>
                    除湿
                </li>
                <li :class="{'on':ac.speed==='low'||ac.speed==='normal'||ac.speed==='high'}">
                    <a href="#" class="btn-speed" :class="{'btn-s1':ac.speed==='low','btn-s2':ac.speed==='normal','btn-s3':ac.speed==='high'}" @click.prevent="setSpeed($event)"></a>
                    <span v-show="ac.speed==='low'">低</span>
                    <span v-show="ac.speed==='normal'">中</span>
                    <span v-show="ac.speed==='high'">高</span>
                    <span v-show="ac.speed!=='low'&&ac.speed!=='normal'&&ac.speed!=='high'">风速</span>
                </li>
            </ul> -->

    </div>

    <!--<a href="#" class="btn-off" @click.prevent="setOff($event)"></a>-->

    <sub-page
      v-model="toggle"
      class="btns-more"
      title="更多"
      @close="onModalClose">
      <!-- <p>模式</p>
            <ul class="btns">
                <li :class="{on:ac.mode==='auto'}">
                    <a href="#" class="btn-auto" :class="{on:ac.mode==='auto'}" @click.prevent="setMode('auto', $event)"></a>
                    智能
                </li>
                <li :class="{on:ac.mode==='wind'}">
                    <a href="#" class="btn-wind" :class="{on:ac.mode==='wind'}" @click.prevent="setMode('wind', $event)"></a>
                    送风
                </li>
            </ul> -->
      <p>摆风</p>
      <ul class="btns">
        <li :class="{on:ac.wind_up_down==='on'}">
          <a
            :class="{on:ac.wind_up_down==='on'}"
            href="#"
            class="btn-vertical icon-vertical"
            @click.prevent="setWind('wind_up_down', $event)"/>
          上下
        </li>
        <!-- <li :class="{on:ac.wind_left_right==='on'}">
                    <a href="#" class="btn-horizontal" :class="{on:ac.wind_left_right==='on'}" @click.prevent="setWind('wind_left_right', $event)"></a>
                    左右
                </li> -->
      </ul>
    </sub-page>

    <!-- 模式 -->
    <sub-page
      v-model="modeDialogShow"
      class="btns-more"
      title="模式设置"
      @close="onModalClose">
      <ul class="btns">
        <li :class="{on:ac.mode==='auto'}">
          <a
            :class="{on:ac.mode==='auto'}"
            href="#"
            class="icon-auto"
            @click.prevent="setMode('auto', $event)"/>
          智能
        </li>
        <li :class="{on:ac.mode==='cold'}">
          <a
            :class="{on:ac.mode==='cold'}"
            href="#"
            class="icon-cold"
            @click.prevent="setMode('cold', $event)"/>
          制冷
        </li>
        <li :class="{on:ac.mode==='heat'}">
          <a
            :class="{on:ac.mode==='heat'}"
            href="#"
            class="icon-heat"
            @click.prevent="setMode('heat', $event)"/>
          制热
        </li>
        <li :class="{on:ac.mode==='dehumidify'}">
          <a
            :class="{on:ac.mode==='dehumidify'}"
            href="#"
            class="icon-dehumidify"
            @click.prevent="setMode('dehumidify', $event)"/>
          除湿
        </li>
        <li :class="{on:ac.mode==='wind'}">
          <a
            :class="{on:ac.mode==='wind'}"
            href="#"
            class="icon-wind"
            @click.prevent="setMode('wind', $event)"/>
          送风
        </li>
      </ul>
    </sub-page>

    <!-- 风速 -->
    <sub-page
      v-model="speedDialogShow"
      class="btns-more"
      title="风速设置"
      @close="onModalClose">
      <ul class="btns">
        <li :class="{'on':ac.speed==='low'}">
          <a
            :class="{'on':ac.speed==='low'}"
            href="#"
            class="icon-s1"
            @click.prevent="setSpeed($event,'low')"/>
          <span>低</span>
        </li>
        <li :class="{'on':ac.speed==='normal'}">
          <a
            :class="{'on':ac.speed==='normal'}"
            href="#"
            class="icon-s2"
            @click.prevent="setSpeed($event,'normal')"/>
          <span>中</span>
        </li>
        <li :class="{'on':ac.speed==='high'}">
          <a
            :class="{'on':ac.speed==='high'}"
            href="#"
            class="icon-s3"
            @click.prevent="setSpeed($event,'high')"/>
          <span>高</span>
        </li>
      </ul>
    </sub-page>

  </div>
</template>

<script>
import Modal from '../../../lib/components/Modal.vue';
import SubPage from "../../../lib/components/SubPage.vue";
import Icon from '../../../lib/components/SettingIconMobile.vue';

const tips = {
    fail: '设置失败',
    temperature: '温度设置成功',
    speed_low: '低风切换成功',
    speed_normal: '中风切换成功',
    speed_high: '高风切换成功',
    speed_auto: '自动风速切换成功',
    mode_cold: '制冷模式切换成功',
    mode_auto: '智能模式切换成功',
    mode_heat: '制热模式切换成功',
    mode_dehumidify: '除湿模式切换成功',
    mode_wind: '送风模式切换成功',
    wind_up_down_on: '上下扫风已启动',
    wind_up_down_off: '上下扫风已关闭',
    wind_left_right_on: '左右扫风已启动',
    wind_left_right_off: '左右扫风已关闭',
    err_temp1: '送风模式下不能设置温度',
    err_temp2: '温度已调至最高',
    err_temp3: '温度已调至最低'
};
const SPEED = ['low', 'normal', 'high'];
const [MIN_TEMP, MAX_TEMP] = [16, 31];
let tempDelay,
    tempFlag = true;

export default {
    components: {
        Modal,
        Icon,
        SubPage
    },
    props: {
        control: {
            type: Function
        },
        device: {
            type: Object
        },
        ac: {
            type: Object
        }
    },
    data() {
        return {
            temperature: this.ac.temperature,
            toggle: false,
            tipVisible: false,
            modeDialogShow: false,
            speedDialogShow: false,
            tip: ''
        };
    },
    computed: {
        modeText() {
            return {
                cold: '制冷模式',
                heat: '制热模式',
                dehumidify: '除湿模式',
                auto: '智能模式',
                wind: '送风模式'
            }[this.ac.mode];
        },
        speedText() {
            return {
                low: '低风',
                overlow: '低风',
                normal: '中风',
                overnormal: '中风',
                high: '高风'
                // 'auto': '自动风'
            }[this.ac.speed];
        }
    },
    mounted() {
      this.changeStatus(false)
      this.$watch('toggle', this.changeStatus)
      this.$watch('modeDialogShow', this.changeStatus)
      this.$watch('speedDialogShow', this.changeStatus)
      window.addEventListener('hashchange', this.onHashChange)
    },
    beforeDestroy() {
      window.removeEventListener('hashchange', this.onHashChange)
    },
    methods: {
        onHashChange() {
            let hash = location.hash
            if(!hash) {
                this.toggle = false
                this.modeDialogShow = false
                this.speedDialogShow = false
            }
        },
        onModalClose() {
            history.go(-1)
        },
        changeStatus(val) {
            HdSmart.UI.setStatusBarColor(val ? 2 : 1)
        },
        goDetail() {
            HdSmart.UI.goDeviceDetail()
        },
        back() {
            HdSmart.UI.popWindow()
        },
        //同步
        syncTemp() {
            if (tempFlag) {
                this.temperature = this.ac.temperature;
            }
        },
        setOff(event) {
            this.control('switch', 'off', event.target, () => {}, this.onSetError());
        },
        setTemperature(val, event) {
            if (this.ac.mode === 'wind') {
                this.showTip('送风模式下不能设置温度');
                return;
            }
            if (this.ac.mode === 'auto') {
                this.showTip('智能模式下不能设置温度');
                return;
            }
            if (this.ac.mode == 'dehumidify') {
                this.showTip('除湿模式下不能设置温度');
                return;
            }

            var temp = this.temperature + val;

            if (temp < MIN_TEMP) {
                if (this.ac.temperature == MIN_TEMP) {
                    this.showTip(tips.err_temp3);
                    return;
                } else {
                    temp = MIN_TEMP;
                }
            }

            if (temp > MAX_TEMP) {
                if (this.ac.temperature == MAX_TEMP) {
                    this.showTip(tips.err_temp2);
                    return;
                } else {
                    temp = MAX_TEMP;
                }
            }

            this.temperature = temp;
            clearTimeout(tempDelay);
            tempFlag = false;
            tempDelay = setTimeout(() => {
                tempFlag = true;
                if (this.checkCmd('temperature', temp)) {
                    this.syncTemp();
                    return;
                }
                this.control(
                    'temperature',
                    this.temperature,
                    event.target,
                    this.onSetSuccess(tips.temperature),
                    this.onSetError(true)
                );
            }, 500);
        },
        setSpeed(event, speed) {
            if (this.ac.mode == 'dehumidify') {
                this.showTip('除湿模式下不可设置风速');
                return;
            }

            // var index = SPEED.indexOf(this.ac.speed);
            // var next = index === SPEED.length - 1 ? 0 : index + 1;
            // var speed = SPEED[next];
            if (this.checkCmd('speed', speed)) {
                return;
            }
            this.control('speed', speed, event.target, this.onSetSuccess(tips['speed_' + speed]), this.onSetError());
        },
        setMode(mode, event) {
            if (this.checkCmd('mode', mode)) {
                return;
            }

            this.control('mode', mode, event.target, this.onSetSuccess(tips['mode_' + mode]), this.onSetError());
        },
        setWind(attr, event) {
            var val = this.ac[attr] === 'on' ? 'off' : 'on';
            this.control(attr, val, event.target, this.onSetSuccess(tips[attr + '_' + val]), this.onSetError());
        },
        showMore() {
            this.toggle = !this.toggle;
        },
        showTip(text) {
            if (!text) return;
            this.tip = text;
            this.tipVisible = true;
            clearTimeout(this.tipDelay);
            this.tipDelay = setTimeout(() => {
                this.tipVisible = false;
            }, 3000);
        },
        onSetSuccess(text) {
            return () => {
                this.showTip(text);
            };
        },
        onSetError(isTemp) {
            return () => {
                this.showTip(tips.fail);
                if (isTemp) {
                    this.syncTemp();
                }
            };
        },
        checkCmd(attr, val) {
            var ac = JSON.parse(JSON.stringify(this.ac));
            ac[attr] = val;

            if (attr != 'temperature') {
                ac.temperature = this.temperature;
            }

            if (ac.temperature == MAX_TEMP && ac.speed == 'low' && ac.mode == 'cold') {
                this.showTip('低风、制冷模式下不支持此温度，请调整后重试');
                return true;
            }
            return false;
        }
    }
};
</script>

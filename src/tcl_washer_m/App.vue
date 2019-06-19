<template>
  <div id="app">
    <div 
      v-if="model.switch=='on'" 
      class="page-on">
      <div class="name">{{ device_name }}
        <icon class="redact-white" />
      </div>
      <div 
        v-if="errors.length" 
        class="fault">
        <span 
          v-for="item in errors" 
          :key="item.code" 
          @click="showAlarmTip(item)">{{ item.code }}故障</span>
      </div>
      <a 
        href="" 
        class="btn btn-more" 
        @click.prevent="moreModalVisible = true">
        <i/>
      </a>
      <!-- 待机 -->
      <div 
        v-show="isStandby || isFinish" 
        class="circle">
        <div class="inner">
          <div class="title">{{ currentModeConfig.text }}模式</div>
          <template v-if="isStandby">
            <div class="sub_title">洗衣时间</div>
            <div 
              class="timeleft" 
              v-html="time_left"/>
          </template>
          <template v-else>
            <div class="ok"/>
            <div class="status">洗衣完成</div>
          </template>
        </div>
      </div>
      <!-- 运行中 -->
      <div 
        v-show="isRun || isPause" 
        :class="{run:isRun}" 
        class="circle active">
        <div class="inner">
          <div class="wave wave1"/>
          <div class="wave wave2"/>
          <div class="title">{{ currentModeConfig.text }}模式</div>
          <template v-if="model.operation == 'reserve'">
            <div class="sub_title">预约时间</div>
            <div class="timeleft">{{ model.reserve_wash }}
              <small>时</small>
            </div>
          </template>
          <template v-else>
            <div class="sub_title">剩余总时间</div>
            <div 
              class="timeleft" 
              v-html="time_left"/>
          </template>
          <div class="status">{{ operationText }}</div>
          <div 
            v-show="childLockSwitch" 
            class="lock"/>
        </div>
      </div>
      <!-- 完成 -->
      <div class="btns btns-fn">
        <a 
          href="" 
          class="btn btn-on" 
          @click.prevent="setSwitch('off')">
        <i/>关机</a>
        <a 
          v-show="isStandby || isPause || isFinish" 
          href="" 
          class="btn btn-start" 
          @click.prevent="setControl('start')">
        <i/>启动</a>
        <a 
          v-show="isRun" 
          href="" 
          class="btn btn-pause" 
          @click.prevent="setControl('halt')">
        <i/>暂停</a>
        <a 
          href="" 
          class="btn btn-mode" 
          @click.prevent="modeModalVisible = true">
        <i/>模式选择</a>
        <!-- <a href="" class="btn btn-reserve" @click.prevent="reserveModalVisible = true"><i></i>预约洗衣</a> -->
      </div>

      <!-- 模式 -->
      <sub-page 
        v-model="modeModalVisible" 
        title="模式选择" 
        class="modal-w backControl2">
        <div class="model-wrap">
          <div class="group">
            <div class="title">快洗</div>
            <div class="btns btns-model">
              <mode-button mode="high_speed_15m">快速15分钟</mode-button>
              <mode-button mode="speed_wash_drying">快速洗烘</mode-button>
            </div>
          </div>
          <div class="line"/>
          <div class="group">
            <div class="title">面料</div>
            <div class="btns btns-model">
              <mode-button mode="mix">混合</mode-button>
              <mode-button mode="cotton">棉麻</mode-button>
              <mode-button mode="synthetic">化纤</mode-button>
              <mode-button mode="cardigan">羊毛</mode-button>
            </div>
          </div>
          <div class="line"/>
          <div class="group">
            <div class="title">衣物类型</div>
            <div class="btns btns-model">
              <mode-button mode="baby_clothes">婴儿服</mode-button>
              <mode-button mode="underwear">内衣</mode-button>
              <mode-button mode="cowboy_suit">牛仔</mode-button>
              <mode-button mode="down_coat">羽绒服</mode-button>
            </div>
          </div>
        </div>
      </sub-page>
      <!-- 更多 -->
      <sub-page 
        v-model="moreModalVisible" 
        title="更多" 
        class="modal-w modal-more backControl">
        <div class="more-wrap">
          <div class="group group-one">
            <div class="title">更多模式</div>
            <div class="btns btns-more_model">
              <mode-button mode="strong_wash">强力</mode-button>
              <mode-button mode="normal_drying">标准烘干</mode-button>
              <mode-button mode="spin">单脱水</mode-button>
              <mode-button mode="rinse_spin">漂洗+脱水</mode-button>
              <mode-button mode="odor_removal">除味</mode-button>
              <mode-button mode="antimite">除螨</mode-button>
            </div>
          </div>
          <div class="group group-two">
            <div class="title">高级设置</div>
            <div 
              v-show="temperatureOptions.length" 
              :class="{active:currentSet==0,disable:isRun||isPause}" 
              class="selectbox">
              <div 
                class="hd" 
                style="border-top:none" 
                @click="toggleSet(0)">
                <div class="left">水温</div>
                <div class="right">
                  <span class="value">{{ currentTemperature.text }}</span>
                  <i class="arrow"/>
                </div>
              </div>
              <div class="bd">
                <span 
                  v-for="item in temperatureOptions" 
                  :key="item.value" 
                  :class="{selected:currentTemperature.value==item.value}" 
                  class="option" 
                  @click="setTemperature(item)">{{ item.text }}</span>
              </div>
            </div>
            <div 
              v-show="detergentOptions.length" 
              :class="{active:currentSet==1,disable:isRun||isPause}" 
              class="selectbox">
              <div 
                class="hd" 
                @click="toggleSet(1)">
                <div class="left">洗涤剂投放</div>
                <div class="right">
                  <span class="value">{{ currentDetergent.text }}</span>
                  <i class="arrow"/>
                </div>
              </div>
              <div class="bd">
                <span 
                  v-for="item in detergentOptions" 
                  :key="item.value" 
                  :class="{selected:currentDetergent.value==item.value}" 
                  class="option" 
                  @click="setDetergent(item)">{{ item.text }}</span>
              </div>
            </div>
            <div 
              v-show="dryingOptions.length" 
              :class="{active:currentSet==2,disable:isRun||isPause}" 
              class="selectbox">
              <div 
                class="hd" 
                @click="toggleSet(2)">
                <div class="left">烘干</div>
                <div class="right">
                  <span class="value">{{ currentDrying.text }}</span>
                  <i class="arrow"/>
                </div>
              </div>
              <div class="bd">
                <span 
                  v-for="item in dryingOptions" 
                  :key="item.value" 
                  :class="{selected:currentDrying.value==item.value}" 
                  class="option" 
                  @click="setDrying(item)">{{ item.text }}</span>
              </div>
            </div>
          </div>
          <div 
            :class="{disable:!isRun}" 
            class="selectbox lockDetail">
            <div class="hd">
              <div class="left">童锁</div>
              <div class="right sb-wrap">
                <switch-button 
                  :value="childLockSwitch" 
                  :sync="true" 
                  :disabled="!isRun" />
                <div 
                  class="sb-btn" 
                  @click="confirmChildLock"/>
              </div>
            </div>
            <!-- <div class="bd1 childlock_confirm" v-show="confirmChildLockVisible">
                                关闭童锁后，所有按键可正常使用。确定关闭？
                                <div class="right">
                                    <a href="" class="cancel" @click.prevent="confirmChildLockVisible = false">取消</a>
                                    <a href="" class="submit" @click.prevent="submitChildLock">关闭</a>
                                </div>
                            </div> -->
          </div>
        </div>
      </sub-page>
      <!-- 预约 -->
      <modal 
        v-model="reserveModalVisible" 
        title="预约洗衣" 
        class="modal-w">
        <div class="reserve-wrap">
          <span class="text1">将在</span>
          <span class="text2">小时完成洗衣</span>
          <picker 
            :slots="numberSlot" 
            :item-height="itemHeight" 
            :visible-item-count="5" 
            @change="onNumberChange"/>
        </div>
        <div class="reserve-foot">
          <a 
            href="" 
            class="cancel" 
            @click.prevent="cancelReserve">取消</a>
          <a 
            href="" 
            class="submit" 
            @click.prevent="submitReserve">确定</a>
        </div>
      </modal>
    </div>
    <div 
      v-if="model.switch=='off'" 
      class="page-off">
      <div class="name">{{ device_name }}
        <icon />
      </div>
      <div class="tip">已关闭</div>
      <div class="washer"/>
      <div class="off_button">
        <a 
          href="" 
          class="btn btn-off" 
          @click.prevent="setSwitch('on')">
          <i/>
        </a>
      </div>
    </div>

    <!--初始化失败界面-->
    <div 
      v-if="status=='error' || model.operation=='abnormal'" 
      class="page-error" 
      @click="getSnapShot">
      <div class="error-tip">
        <img src="../../lib/base/washer/assets/init_err.png" >
        <p>加载失败，请点击屏幕刷新</p>
      </div>
    </div>
  </div>
</template>


<script>
import Modal from '../../lib/components/Modal.vue';
import SwitchButton from '../../lib/components/SwitchButton.vue';
import Picker from '../../lib/components/Picker/picker.vue';
import ModeButton from './components/ModeButton.vue';
import SubPage from '../../lib/components/SubPage.vue';
import Icon from '../../lib/components/SettingIconMobile.vue';

import {
    MODE_OPTIONS,
    RESERVE_TIME_OPTIONS,
    TEMPERATURE_OPTIONS,
    DRY_OPTIONS,
    DETERGENT_OPTIONS,
    OPERATION_OPTIONS,
    ERROR_CODE,
    DEFAULT_ERROR_MSG
} from './config';

const radio = (document.documentElement.clientWidth || window.innerWidth) / 750 * 75;

// function getToggle(val) {
//     return val === 'on' ? 'off' : 'on';
// }

function formatTime(time) {
    var hour = Math.floor(time / 60);
    var minute = time % 60;
    var result = '';
    if (hour > 0) {
        result += `${hour}<small>时</small>`;
    }
    result += `${minute}<small>分</small>`;
    return result;
}

function findIndex(array, fn) {
    for (var i = 0; i < array.length; i++) {
        if (fn(array[i])) {
            return i;
        }
    }
    return -1;
}

export default {
    components: {
        Modal,
        SwitchButton,
        Picker,
        ModeButton,
        SubPage,
        Icon
    },
    data() {
        return {
            status: '',
            model: {},
            device_name: '',
            moreModalVisible: false,
            modeModalVisible: false,
            reserveModalVisible: false,
            currentReserveTime: 0,
            confirmChildLockVisible: false,
            currentSet: -1,
            number: 0,
            itemHeight: 1.2 * radio,
            errors: []
        };
    },
    computed: {
        isRun() {
            return this.model.status == 'run';
        },
        isPause() {
            return this.model.status == 'standby' && this.model.operation != 'none' && this.model.operation != 'finish';
        },
        isStandby() {
            return this.model.status == 'standby' && this.model.operation == 'none';
        },
        isFinish() {
            return this.model.status == 'standby' && this.model.operation == 'finish';
        },
        numberSlot() {
            var values = RESERVE_TIME_OPTIONS.map((item) => {
                return `${item}`;
            });
            return [
                {
                    flex: 1,
                    defaultIndex: this.model.reserve_wash ? this.model.reserve_wash - 3 : 0,
                    values: values,
                    className: 'slot1'
                }
            ];
        },
        time_left() {
            return formatTime(this.model.time_left);
        },
        operationText() {
            return this.isRun ? OPERATION_OPTIONS[this.model.operation] : '暂停中';
        },
        childLockSwitch() {
            return this.model.child_lock_switch == 'on' ? true : false;
        },
        currentModeConfig() {
            return MODE_OPTIONS[this.model.mode];
        },
        temperatureOptions() {
            var temperatureConfig = this.currentModeConfig.temperature;
            return TEMPERATURE_OPTIONS.filter((item, i) => {
                return temperatureConfig.options.indexOf(i) >= 0;
            });
        },
        dryingOptions() {
            var dryingConfig = this.currentModeConfig.drying;
            return DRY_OPTIONS.filter((item, i) => {
                return dryingConfig.options.indexOf(i) >= 0;
            });
        },
        detergentOptions() {
            var detergentConfig = this.currentModeConfig.detergent;
            return DETERGENT_OPTIONS.filter((item, i) => {
                return detergentConfig.options.indexOf(i) >= 0;
            });
        },
        currentTemperature() {
            var result = this.temperatureOptions.filter(item => {
                return item.value == this.model.temperature;
            });
            return result[0] || {};
        },
        currentDrying() {
            var result = this.dryingOptions.filter(item => {
                return item.value == this.model.drying;
            });
            return result[0] || {};
        },
        currentDetergent() {
            var result = this.detergentOptions.filter(item => {
                return item.value == this.model.auto_detergent_switch;
            });
            return result[0] || {};
        }
    },
    watch: {
        isRun(val) {
            if (val) {
                this.currentSet = -1;
            }
        },
        moreModalVisible(val) {
            if (val) {
                HdSmart.UI.toggleHeadAndFoot(false); //隐藏app头部
            } else {
                HdSmart.UI.toggleHeadAndFoot(true); //显示app头部
            }
        },
        modeModalVisible(val) {
            if (val) {
                HdSmart.UI.toggleHeadAndFoot(false); //隐藏app头部
            } else {
                HdSmart.UI.toggleHeadAndFoot(true); //显示app头部
            }
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }
            HdSmart.UI.showLoading();
            this.getSnapShot();
        });
        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
        HdSmart.onDeviceAlert(data => {
            if (data.method == 'dr_report_dev_alert') {
                this.getAlertList(data.result.attribute.error);
            } else {
                this.onDaAlert(data.result.attribute.error);
            }
        });
    },
    methods: {
        controlDevice(attr, val, success, error) {
            // if(this.errors.length){
            //     this.showAlarmTip(this.errors[0])
            //     return
            // }
            if (this.model.child_lock_switch == 'on' && attr != 'child_lock_switch') {
                HdSmart.UI.toast('请先关闭童锁');
                return;
            }

            var params = {
                [attr]: val
            };

            if (attr == 'mode') {
                //要切到待机模式
            }

            HdSmart.Device.control(
                {
                    method: 'dm_set',
                    nodeid: `wash_machine.main.${attr}`,
                    params: {
                        attribute: params
                    }
                },
                () => {
                    success && success();
                },
                () => {
                    error && error();
                }
            );
        },
        setSwitch(val) {
            this.controlDevice('switch', val);
        },
        setControl(val) {
            if (this.model.operation == 'drying' && val == 'halt') {
                HdSmart.UI.toast('烘干时不可暂停');
                return;
            }
            this.controlDevice('control', val);
        },
        setMode(mode) {
          console.log(mode)
            if (this.isRun || this.isPause) {
                return;
            }
            if (this.model.mode == mode) {
                return;
            }
            this.controlDevice('mode', mode, () => {
                this.model.mode = mode;
            });
        },
        setChildLock(val, callback) {
            this.controlDevice('child_lock_switch', val, callback);
        },
        setReserve(time) {
            if (this.isRun) {
                HdSmart.UI.toast('运行中无法设置预约');
                return;
            }
            this.controlDevice('reserve_wash', parseInt(time));
        },
        setTemperature(item) {
            if (this.isRun) {
                return;
            }
            if (item.value == this.currentTemperature.value) {
                return;
            }
            this.controlDevice('temperature', parseInt(item.value), () => {
                this.model.temperature = item.value;
            });
        },
        setDetergent(item) {
            if (this.isRun) {
                return;
            }
            if (item.value == this.currentDetergent.value) {
                return;
            }
            this.controlDevice('auto_detergent_switch', item.value, () => {
                this.model.auto_detergent_switch = item.value;
            });
        },
        setDrying(item) {
            if (this.isRun) {
                return;
            }
            if (item.value == this.currentDrying.value) {
                return;
            }
            this.controlDevice('drying', item.value, () => {
                this.model.drying = item.value;
            });
        },
        cancelReserve() {
            this.reserveModalVisible = false;
            this.setReserve(0);
        },
        submitReserve() {
            this.reserveModalVisible = false;
            this.setReserve(this.number);
        },
        onNumberChange(picker, values) {
            this.number = values[0];
        },
        confirmChildLock() {
            if (this.childLockSwitch) {
                // this.confirmChildLockVisible = true;
                HdSmart.UI.alert(
                    {
                        message: '关闭童锁后，所有按键可正常使用。确定关闭？'
                    },
                    val => {
                        if (val) {
                            this.submitChildLock();
                        }
                    }
                );
            } else {
                if (this.isRun) {
                    this.setChildLock('on', () => {
                        this.model.child_lock_switch = 'on';
                    });
                } else {
                    HdSmart.UI.toast('运行中才能开启童锁');
                }
            }
        },
        submitChildLock() {
            this.setChildLock('off', () => {
                // this.confirmChildLockVisible = false;
                this.model.child_lock_switch = 'off';
            });
        },
        toggleSet(index) {
            if (this.isRun || this.isPause) {
                return;
            }
            this.currentSet = this.currentSet == index ? -1 : index;
        },
        getSnapShot(cb) {
            HdSmart.Device.getSnapShot(
                data => {
                    this.onSuccess(data);
                    cb && cb();
                },
                () => {
                    this.onError();
                    cb && cb();
                }
            );
        },
        onSuccess(data) {
            HdSmart.UI.hideLoading();
            this.status = 'success';

            this.model = data.attribute;

            this.getAlertList(data.attribute.error);
        },
        onError() {
            this.status = 'error';
        },
        getAlertList(errors) {
            errors = errors || [];
            this.errors = errors.filter(item => {
                return item.status == 1;
            });
        },
        onDaAlert(errors) {
            var error = errors[0];
            //当前故障
            var index = findIndex(this.errors, item => {
                return item.code == error.code;
            });
            if (index >= 0) {
                this.errors.splice(index, 1);
            }
            if (error.status == 1) {
                this.errors.push(error);
            }
        },
        showAlarmTip(err) {
            var msg = ERROR_CODE[err.code] || DEFAULT_ERROR_MSG;
            HdSmart.UI.alert(
                {
                    title: '故障',
                    message: err.code + ' ' + msg,
                    cancelText: '',
                    onText: '知道了'
                },
                val => {
                    if (val) {
                        // HdSmart.Device.control({
                        //     method: 'dm_set',
                        //     "nodeid": "wifi.main.alarm_confirm",
                        //     "params": {
                        //         "attribute": {
                        //             "error_code": err.code
                        //         }
                        //     }
                        // }, () => {})
                    }
                }
            );
        },
        inError(error) {
            return (
                findIndex(this.errors, item => {
                    return item.code == error;
                }) >= 0
            );
        }
    },
};
</script>

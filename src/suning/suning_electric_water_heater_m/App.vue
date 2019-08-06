<template>
    <div id="app">
        <div class="page-on" v-show="status =='error' || model.switch=='on'">
            <div class="ani"></div>
            <div class="inner">
                <div class="device_name">{{device_name}}
                    <icon class="redact-white" />
                </div>
                <div class="status">{{statusText}}</div>
                <div class="current_temp">
                    <strong>{{model.temperature}}</strong>
                    <small>℃</small>
                    <p>当前温度</p>
                </div>
                <div class="set_temp">
                    <p>
                        <span>预设温度</span>{{temp}}℃</p>
                    <a href="" class="btn btn-reduce" :class="{disabled:tempDisabled}" @click.prevent="setTempDown">
                        <i></i>
                    </a>
                    <a href="" class="btn btn-add" :class="{disabled:tempDisabled}" @click.prevent="setTempUp">
                        <i></i>
                    </a>
                    <div class="slider">
                        <slider ref="tempSlider" v-model="temp" :options="sliderOptions" @change="onTempChange" :disabled="tempDisabled" />
                        <span class="min">{{sliderOptions.range.min}}℃</span>
                        <span class="max">{{sliderOptions.range.max}}℃</span>
                    </div>
                </div>

                <a href="" class="btn btn-shut" @click.prevent="setSwitch('off')">
                    <i></i>
                </a>

                <div class="btns">

                    <a href="" class="btn btn-heating_half" :class="{active:model.mode=='half_tank'}" @click.prevent="setMode('half_tank')">
                        <i></i>
                        <span>半胆速热</span>
                    </a>
                    <a href="" class="btn btn-heating_whole" :class="{active:model.mode=='full_tank'}" @click.prevent="setMode('full_tank')">
                        <i></i>
                        <span>整胆加热</span>
                    </a>
                    <a href="" class="btn btn-heating_append" :class="{active:model.mode=='max_volume'}" @click.prevent="setMode('max_volume')">
                        <i></i>
                        <span>蓄热增容</span>
                    </a>
                    <a href="" class="btn btn-intelligentbath" :class="{active:model.mode=='smart'}" @click.prevent="setMode('smart')">
                        <i></i>
                        <span>智能沐浴</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="page-off" v-show="model.switch=='off'">
            <div class="device_name">{{device_name}}
                <icon />
            </div>
            <div class="status">已关闭</div>
            <div class="pic"></div>
            <div class="btns">
                <a href="" class="btn btn-turnon" @click.prevent="setSwitch('on')">
                    <i></i>
                </a>
            </div>
        </div>

        <div class="alert-wraper" v-if="model.fault && model.fault!='normal'">
            <div class="alert">
                <i></i> {{errorText}}
            </div>
        </div>
    </div>
</template>

<script>
import Slider from './components/Slider.vue';
import Icon from '@lib/components/SettingIconMobile.vue';

const [TEMP_MIN, TEMP_MAX] = [30, 75];

function createBubble(container, option) {
    if (!container) return;

    var el = document.createElement('div');
    el.className = 'bubble';
    el.style.left = option.left + 'px';
    el.style.top = option.top + 'px';
    el.style.width = el.style.height = '20px';

    container.appendChild(el);

    el.addEventListener(
        'transitionend',
        function() {
            container.removeChild(container.firstChild);
        },
        false
    );

    setTimeout(function() {
        el.style.top = '-200px';
        el.style.width = el.style.height = '50px';
    }, 100);
}

export default {
    components: {
        Slider,
        Icon
    },
    data() {
        return {
            model: {},
            temp: 50,
            sliderOptions: {
                connect: [true, false],
                step: 1,
                range: {
                    min: TEMP_MIN,
                    max: TEMP_MAX
                }
            },
            device_name: '',
            status: ''
        };
    },
    computed: {
        statusText() {
            switch (this.model.heat_status) {
                case 'heat':
                    return '正在加热';
                case 'keep_warm':
                    return '保温';
                case 'reserve':
                    return '预约';
                default:
                    return '';
            }
        },
        tempDisabled() {
            return this.model.mode == 'max_volume';
        },
        errorText() {
            switch (this.model.fault) {
                case 'normal':
                    return '正常';
                case 'dry_heat':
                    return '热水器干烧，请检查设备';
                case 'sensor_error':
                    return '热水器传感器故障，请检查设备';
                case 'over_temperature':
                    return '热水器超温，请检查设备';
                default:
                    return '热水器故障，请检查设备';
            }
        }
    },
    watch: {
        'model.set_temperature'(val) {}
    },
    methods: {
        controlDevice(attr, value) {
            if (this.model.fault && this.model.fault != 'normal') {
                HdSmart.UI.toast(this.errorText);
                return;
            }
            //切换模式的时候加上温度字段
            let temperature = {};
            if (attr === 'mode') {
                let oldVal = this.getOldTemperature(value);
                temperature = oldVal ? { set_temperature: oldVal } : {};
            }

            HdSmart.Device.control(
                {
                    nodeid: `water_heater.main.${attr === 'mode' ? 'custom' : attr}`,
                    params: {
                        attribute: {
                            [attr]: value,
                            ...temperature
                        }
                    }
                },
                () => {},
                () => {}
            );
        },
        setTempUp() {
            if (this.tempDisabled) {
                return;
            }
            if (this.temp < TEMP_MAX) {
                this.temp++;
            }
        },
        setTempDown() {
            if (this.tempDisabled) {
                return;
            }
            if (this.temp > TEMP_MIN) {
                this.temp--;
            }
        },
        onTempChange(val) {
            if (val == this.model.set_temperature) {
                return;
            }

            //缓存设置的温度到本地
            this.setOldTemperature(val);
            this.controlDevice('set_temperature', val);
        },
        setSwitch(val) {
            this.controlDevice('switch', val);
        },
        setMode(val) {
            this.$refs.tempSlider.isUpdating = false;
            this.controlDevice('mode', val);
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot(
                data => {
                    HdSmart.UI.hideLoading();
                    this.onSuccess(data);
                    //初始化缓存温度
                    this.setOldTemperature(this.model.set_temperature);
                },
                () => {
                    this.status = 'error';
                    HdSmart.UI.hideLoading();
                }
            );
        },
        onSuccess(data) {
            this.status = 'success';
            this.model = data.attribute;
            if (!this.$refs.tempSlider.isUpdating) {
                this.temp = this.model.set_temperature;
            }
        },
        //从本地缓存中获取温度数据
        getOldTemperature(mode) {
            return (window.device_uuid && this.getCurrentStorage()[mode]) || 0;
        },
        //获取当前device_uuid的缓存object
        getCurrentStorage() {
            return (localStorage.getItem(window.device_uuid) && JSON.parse(localStorage.getItem(window.device_uuid))) || {};
        },
        setOldTemperature(val) {
            if (this.model.mode && window.device_uuid) {
                localStorage.setItem(
                    window.device_uuid,
                    JSON.stringify(
                        Object.assign(this.getCurrentStorage() || {}, {
                            [this.model.mode]: val
                        })
                    )
                );
            }
        }
    },
    created() {
        HdSmart.ready(() => {
            if (window.device_name) {
                this.device_name = window.device_name;
            }

            this.getSnapShot();
        });

        HdSmart.onDeviceStateChange(data => {
            this.onSuccess(data.result);
        });
    },
    mounted() {
        var el = this.$el.querySelector('.ani');
        var top = document.documentElement.offsetHeight;
        var width = document.documentElement.offsetWidth;
        setInterval(() => {
            if (this.model.switch == 'on') {
                createBubble(el, {
                    left: Math.random() * width,
                    top: top
                });
            }
        }, 1500);
    }
};
</script>

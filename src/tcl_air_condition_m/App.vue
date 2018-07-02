<template>
    <div class="wrap">
        <page-on v-if="ac.switchStatus==='on'" :control="controlDevice" :device="device" :ac="ac" ref="airon" />
        <page-off v-if="ac.switchStatus==='off'" :control="controlDevice" :device="device" />
        <!-- <page-error v-if="status==='ERROR'" :reload="init" /> -->
    </div>
</template>

<script>
import PageOn from "./components/PageOn.vue";
import PageOff from "./components/PageOff.vue";
import PageError from "./components/PageError.vue";

const DefaultSpin = require("../../lib/base/air_condition/assets/buffering_power_white.gif");
const BlueSpin = require("../../lib/base/air_condition/assets/buffering_power_blue.gif");
let tempRadio = 10;

let store = {};

function getStoreKey() {
    return window.device_uuid + "_remember";
}

function getStore() {
    return JSON.parse(localStorage.getItem(getStoreKey()) || "{}");
}

function setStore(json) {
    localStorage.setItem(getStoreKey(), JSON.stringify(json));
}

export default {
    components: {
        "page-on": PageOn,
        "page-off": PageOff,
        "page-error": PageError
    },
    data() {
        return {
            status: "", //SUCCESS,ERROR
            ac: {
                temperature: 0, //[16,30]
                switchStatus: "", //on,off(发送指令为switch)
                mode: "", //auto,cold,heat,dehumidify,wind
                speed: "", //low,normal,high,auto
                wind_up_down: "", //on,off
                wind_left_right: "" //on,off
            },
            device: {}
        };
    },
    methods: {
        showSpin(ele, style) {
            if (!ele) {
                return;
            }
            this.removeSpin();
            this.loadingDelay = setTimeout(() => {
                this.spinner = document.createElement("img");
                this.spinner.style.width = "100%";
                this.spinner.style.height = "100%";
                this.spinner.src = style === "blue" ? BlueSpin : DefaultSpin;
                this.loadingEl = ele;
                this.loadingEl.appendChild(this.spinner);
            }, 800);
        },
        removeSpin() {
            clearTimeout(this.loadingDelay);
            if (this.spinner) {
                this.loadingEl.removeChild(this.spinner);
                this.spinner = null;
            }
        },
        controlDevice(attr, val, target, success, error) {
            if (this.ac[attr] === val) {
                return;
            }
            let style = "default";
            if (attr === "switch" && val === "on") {
                style = "blue";
            } else if (
                (attr === "wind_up_down" || attr === "wind_left_right") &&
                val === "on"
            ) {
                style = "blue";
            } else if (attr === "mode" && (val === "auto" || val === "wind")) {
                style = "blue";
            }
            this.showSpin(target, style);

            let params = {
                [attr]: attr == "temperature" ? val * tempRadio : val
            };

            let store = getStore();

            if (attr == "switch" && val == "on") {
                if (store.mode) {
                    params.mode = store.mode;
                    let modeStore = store[params.mode] || {};
                    if (modeStore.temperature) {
                        params.temperature = modeStore.temperature;
                    }
                    if (modeStore.speed) {
                        params.speed = modeStore.speed;
                    }
                }
            } else if (attr == "mode") {
                let modeStore = store[val] || {};
                if (modeStore.temperature) {
                    params.temperature = modeStore.temperature;
                }
                if (modeStore.speed) {
                    params.speed = modeStore.speed;
                }
            }

            HdSmart.Device.control(
                {
                    method: "dm_set",
                    nodeid: `airconditioner.main.${attr}`,
                    params: {
                        attribute: params
                    }
                },
                res => {
                    if (attr == "switch") {
                        this.ac.switchStatus = val;
                    } else {
                        this.ac[attr] = val;
                    }
                    this.removeSpin();

                    if (!store[this.ac.mode]) {
                        store[this.ac.mode] = {};
                    }

                    switch (attr) {
                        case "temperature":
                            store[this.ac.mode].temperature = params[attr];
                            setStore(store);
                            break;
                        case "speed":
                            store[this.ac.mode].speed = params[attr];
                            setStore(store);
                            break;
                        case "mode":
                            store.mode = params[attr];
                            setStore(store);
                            break;
                    }

                    success && success();
                },
                () => {
                    this.removeSpin();
                    error && error();
                }
            );
        },
        setAttr(attrs) {
            // for(var p in attrs){
            //     this.ac[p==='switch'?'switchStatus':p] = attrs[p]
            // }
            attrs.temperature = attrs.temperature / tempRadio;
            this.ac = attrs;
        },
        init() {
            HdSmart.ready(() => {
                HdSmart.UI.showLoading();
                if (window.device_name) {
                    this.device.name = window.device_name;
                }
                this.getSnapShot();
            });
        },
        getSnapShot() {
            HdSmart.Device.getSnapShot(
                res => {
                    HdSmart.UI.hideLoading();
                    this.onSuccess(res);
                },
                () => {
                    HdSmart.UI.hideLoading();
                    this.onError();
                }
            );
        },
        onSuccess(data) {
            if (data && data.attribute) {
                if (data.attribute.operation === "abnormal") {
                    this.onError();
                } else {
                    this.status = "SUCCESS";
                    this.setAttr(data.attribute);
                    this.$nextTick(() => {
                        try {
                            this.$refs.airon.syncTemp();
                        } catch (e) {}
                    });

                    if (data.attribute.deviceSubCategory != undefined) {
                        this.device.category_id =
                            data.attribute.deviceSubCategory;
                    }
                }
            }
        },
        onError() {
            this.status = "ERROR";
            this.ac.switchStatus = 'on'
            this.ac.temperature = 0
            this.$nextTick(() => {
                try {
                    this.$refs.airon.syncTemp();
                } catch (e) {}
            });
        }
    },
    created() {
        HdSmart.onDeviceStateChange(res => {
            this.onSuccess(res.result);
        });
        this.init();
    }
};
</script>


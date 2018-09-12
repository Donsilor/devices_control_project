<template>
    <div id="app" :class="todyClass">
        <!--城市切换-->
        <template v-if="showSwitchCity">
            <switchCity @hideswitch="hideSwitchCity" :city="city" :getCityWeather="getCityWeather" :todyClass="todyClass"></switchCity>
        </template>
        <!--城市切换-->
        <template v-else>
            <span class="weather-close" @click.prevent="close">关闭</span>
            <span v-if="success" class="switch" @click="switchCity">
                <span class="s-icon"></span>
                <span class="s-text">城市切换</span>
            </span>
            <div class="title">{{currentDate}}&nbsp;&nbsp;{{currentWeek}}&nbsp;&nbsp;{{currentOldDay}}</div>
            <template v-if="success">
                <div class="city">
                    <div class="city-name" style="margin-top: 10px">{{city.name}}</div>
                    <div>
                        <span class="img" :class="curMinBg"></span>
                    </div>
                    <div class="city-name">{{acturlTemp}}℃&nbsp;&nbsp;{{acturlCondition}}</div>
                    <div class="city-detail">
                        <!--<span>降水概率：10%</span>-->
                        <!--<span>湿度：74%</span>-->
                        <span v-if="curAQIvalue">实时空气质量：
                            <i :class="airLevel">{{curAQIvalue}}&nbsp;{{airLevelText}}</i>
                        </span>
                    </div>
                </div>
                <div class="weather-list-con">
                    <ul class="weather-list">
                        <li v-for="(item, index) in wList" :key="index">
                            <div class="">{{index === 0 ? '今天' : item.predictDate}}</div>
                            <div>{{item.weekday}}</div>
                            <div class="w-icon">
                                <i :class="renderClass(item.conditionIdDay)"></i>
                            </div>
                            <div class="">{{item.tempNight}}～{{item.tempDay}}℃</div>
                            <div class="">{{item.conditionDay}}</div>
                            <div class="">{{item.windDirDay}}&nbsp;{{item.windLevelDay}}级</div>
                        </li>
                    </ul>
                </div>
            </template>
            <template v-else>
                <div class="error_tip" @click="getWeatherData">
                    <div class="icon"></div>
                    <div class="msg">无法连接网络，请检查网络后
                        <span>点击屏幕刷新</span>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>
<script>
import getOldDate from "./getOldDate";
export default {
    components: { Icon },
    name: "app",
    data() {
        return {
            success: true,
            city: {
                name: ""
            },
            todyClass: "",
            wList: [],
            acturlCondition: "", //实时天气
            acturlTemp: "-- ", //实时温度
            curMinBg: "", //当天天气对应的大图标
            airLevel: "", //空气质量指数
            airLevelText: "", //空气质量描述
            curAQIvalue: "", //实时空气质量
            currentDate: "",
            currentWeek: "", //当天为星期几
            currentOldDay: "", //农历日期
            allWeekDays: [
                { name: "周日", value: 0 },
                { name: "周一", value: 1 },
                { name: "周二", value: 2 },
                { name: "周三", value: 3 },
                { name: "周四", value: 4 },
                { name: "周五", value: 5 },
                { name: "周六", value: 6 }
            ],

            showSwitchCity: false
        };
    },
    mounted() {
        HdSmart.ready(() => {
            let city = JSON.parse(localStorage.getItem("city"));
            if (city) this.city.name = city.name;
            if (city && city.city_id) {
                //走缓存
                this.getWeatherData(city.city_id);
            } else this.getWeatherData();
            // remoteLoad('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', false).then((result) => {
            //     if (remote_ip_info.ret === 1) {
            //         alert(remote_ip_info.city)
            //         //    self.city.name = remote_ip_info.city + '市'
            //         //    let cityId = cityIdJson[self.city.name]
            //         //    self.getWeatherData(cityId)
            //     }
            // })
        });

        window.addEventListener("hashchange", this.hashChange, false);
    },
    destroyed() {
        window.removeEventListener("hashchange", this.hashChange, false);
    },
    methods: {
        // 空气质量
        renderAQI(val) {
            this.curAQIvalue = val;
            if (val < 50) {
                this.airLevel = "air-level-1";
                this.airLevelText = "优";
            } else if (val >= 50 && val < 100) {
                this.airLevel = "air-level-2";
                this.airLevelText = "良";
            } else if (val >= 100 && val < 150) {
                this.airLevel = "air-level-3";
                this.airLevelText = "轻度污染";
            } else if (val >= 150 && val < 200) {
                this.airLevel = "air-level-4";
                this.airLevelText = "中度污染";
            } else if (val >= 200 && val < 300) {
                this.airLevel = "air-level-5";
                this.airLevelText = "重度污染";
            } else {
                this.airLevel = "air-level-6";
                this.airLevelText = "严重污染";
            }
        },
        // 渲染背景图片(对应阴,晴,下雨..等)
        renderTodayClass(val) {
            switch (val) {
                case "0":
                    this.todyClass = "img_bg_weather_sunny";
                    this.curMinBg = "icn_weather_sunny";
                    break;
                case "1":
                    this.todyClass = "img_bg_weather_cloudy";
                    this.curMinBg = "icn_weather_cloudy";
                    break;
                case "2":
                    this.todyClass = "img_bg_weather_cloudy";
                    this.curMinBg = "icn_weather_mostlycloudy";
                    break;
                case "3":
                case "7":
                case "8":
                case "9":
                case "10":
                    this.todyClass = "img_bg_weather_rainy";
                    this.curMinBg = "icn_weather_rainy";
                    break;
                case "4":
                    this.todyClass = "img_bg_weather_thuner";
                    this.curMinBg = "icn_weather_thuner";
                    break;
                case "20":
                case "29":
                    this.todyClass = "img_bg_weather_wind";
                    this.curMinBg = "icn_weather_wind";
                    break;
                case "13":
                case "14":
                case "15":
                case "16":
                case "17":
                    this.todyClass = "img_bg_weather_snowy";
                    this.curMinBg = "icn_weather_snowy";
                    break;
                default:
                    this.todyClass = "img_bg_weather_cloudy";
                    this.curMinBg = "icn_weather_cloudy";
                    break;
            }
        },
        // 渲染6天天气对应的图标图像
        renderClass(val) {
            let curClass = "";
            switch (val) {
                case "0":
                    curClass = "icn_weather_sunny_m";
                    break;
                case "1":
                    curClass = "icn_weather_cloudy_m";
                    break;
                case "2":
                    curClass = "icn_weather_mostlycloudy_m";
                    break;
                case "4":
                    curClass = "icn_weather_thunder_m";
                    break;
                case "3":
                case "7":
                    curClass = "icn_weather_rainy_m";
                    break;
                case "9":
                case "10":
                    curClass = "icn_weather_heavyrain_m";
                    break;
                case "20":
                case "29":
                    curClass = "icn_weather_wind_m";
                    break;
                case "13":
                case "14":
                case "15":
                    curClass = "icn_weather_snow_m";
                    break;
                case "16":
                case "17":
                    curClass = "icn_weather_heavysnow_m";
                    break;
                default:
                    curClass = "icn_weather_cloudy_m";
                    break;
            }
            return curClass;
        },
        getWeatherData(city_id) {
            let now = new Date();
            let thisDay = now.getDay();
            let curIndex = 0;
            let currentWeekArr = [];
            let awds = this.allWeekDays;
            let params = {};
            if (city_id !== undefined && ~~city_id) {
                params.city_id = ~~city_id;
            }

            awds.forEach((item, index) => {
                if (item.value === thisDay) {
                    curIndex = index;
                    this.currentWeek = awds[index].name;
                }
            });
            for (let i = 0; i < 7; i++) {
                if (!awds[curIndex]) {
                    curIndex = 0;
                }
                currentWeekArr.push(awds[curIndex].name);
                curIndex++;
            }
            this.currentDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            this.currentOldDay = getOldDate(); //获取农历日期
            let self = this;
            HdSmart.UI.showLoading();
            HdSmart.Device.control(
                {
                    method: "3d_get_moji_weather",
                    params
                },
                res => {
                    let innerData = (res.result && res.result.data) || "";
                    // 空气质量
                    if (innerData && innerData.aqi) {
                        self.renderAQI(innerData.aqi.value);
                    }
                    // 5天实况
                    if (innerData && innerData.forecast) {
                        let forecast = innerData.forecast;
                        let newArr = forecast.slice(0, forecast.length - 1);
                        self.wList = newArr.map((item, index) => {
                            item.weekday = currentWeekArr[index];
                            return item;
                        });
                        // self.renderTodayClass(self.wList[0].conditionIdDay)
                    }
                    // 实时天气
                    if (innerData && innerData.condition) {
                        self.renderTodayClass(innerData.condition.icon);
                        self.acturlTemp = innerData.condition.temp;
                        self.acturlCondition = innerData.condition.condition;
                    } else {
                        self.actrulTemp = "0";
                    }
                    //城市信息
                    if (!city_id && innerData && innerData.city) {
                        self.city = innerData.city;
                    } else if (!city_id) {
                        self.city = {
                            name: innerData.cityName
                        };
                    }
                    self.success = true;
                    HdSmart.UI.hideLoading();
                },
                err => {
                    self.success = false;
                    HdSmart.UI.hideLoading();
                }
            );
        },
        switchCity() {
            location.hash = "switch";
            this.showSwitchCity = true;
        },
        hideSwitchCity() {
            history.go(-1);
        },
        getCityWeather(city) {
            //TODO
            console.log(city);
            this.city.name = city.name;
            this.getWeatherData(city.city_id);
        },
        //关闭天气预报,替代原生安卓的关闭，需调用原生的方法实现
        close() {
            HdSmart.UI.toggleHeadAndFoot(false);
        },
        hashChange(e) {
            if (location.hash.indexOf("switch") === -1) this.showSwitchCity = false;
        }
    }
};
</script>

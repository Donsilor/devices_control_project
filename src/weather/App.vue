<template>
    <div id="app" :class="todyClass">
        <!--城市切换-->
        <template v-if="showSwitchCity">
            <switchCity @hideswitch="hideSwitchCity" :getCityWeather="getCityWeather"></switchCity>
        </template>
        <!--城市切换-->
        <template v-else>
            <span class="switch" @click="showSwitchCity=true">
                <span class="s-icon"></span>
                <span class="s-text">城市切换</span>
            </span>
        <div class="title">{{currentDate}}&nbsp;&nbsp;{{currentWeek}}&nbsp;&nbsp;{{currentOldDay}}</div>
        <template v-if="success">
        <div class="city">
            <div class="city-name" style="margin-top: 10px">{{city.name}}</div>
            <div><span class="img" :class="curMinBg"></span></div>
            <div class="city-name">{{acturlTemp}}℃&nbsp;&nbsp;{{acturlCondition}}</div>
            <div class="city-detail">
                <!--<span>降水概率：10%</span>-->
                <!--<span>湿度：74%</span>-->
                <span v-if="curAQIvalue">实时空气质量：<i :class="airLevel">{{curAQIvalue}}&nbsp;{{airLevelText}}</i></span>
            </div>
        </div>
        <div class="weather-list-con">
            <ul class="weather-list">
                <li v-for="(item, index) in wList" :key="index">
                    <div class="">{{index === 0 ? '今天' : item.predictDate}}</div>
                    <div>{{item.weekday}}</div>
                    <div class="w-icon"><i :class="renderClass(item.conditionIdDay)"></i></div>
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
                <div class="msg">无法连接网络，请检查网络后 <span>点击屏幕刷新</span></div>
            </div>
        </template>
        </template>
    </div>
</template>
<script>
// import jsonp from 'jsonp'
// import cityIdJson from './assets/cityId.json'
import getOldDate from "./getOldDate";
// import remoteLoad from './loadscript'
export default {
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
            HdSmart.UI.showLoading();
            this.getWeatherData();
            // remoteLoad('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', false).then((result) => {
            //     if (remote_ip_info.ret === 1) {
            //         alert(remote_ip_info.city)
            //         //    self.city.name = remote_ip_info.city + '市'
            //         //    let cityId = cityIdJson[self.city.name]
            //         //    self.getWeatherData(cityId)
            //     }
            // })
        });
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
        getWeatherData() {
            let now = new Date();
            let thisDay = now.getDay();
            let curIndex = 0;
            let currentWeekArr = [];
            let awds = this.allWeekDays;
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
            this.currentDate = `${now.getFullYear()}-${now.getMonth() +
                1}-${now.getDate()}`;
            this.currentOldDay = getOldDate(); //获取农历日期
            let self = this;
            HdSmart.Device.control(
                {
                    method: "3d_get_moji_weather",
                    params: {}
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
                    if (innerData && innerData.city) {
                        self.city = innerData.city;
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
        hideSwitchCity() {
            this.showSwitchCity = false;
        },
        getCityWeather() {
            //TODO
            console.log("getcityweather");
        }
    }
};
</script>
<style lang="less">
body {
    margin: 0;
    height: 100%;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: #fff;
    background-image: linear-gradient(-179deg, #4586e2 5%, #48a8f3 97%);
    font-family: NotoSansHans-Regular;
}
#app {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
/*多云*/
.img_bg_weather_cloudy {
    background: url("./assets/img_bg_weather_cloudy.png");
    background-size: 100% 100%;
}
/*下雨*/
.img_bg_weather_rainy {
    background: url("./assets/img_bg_weather_rainy.png");
    background-size: 100% 100%;
}
/*下雪*/
.img_bg_weather_snowy {
    background: url("./assets/img_bg_weather_snowy.png");
    background-size: 100% 100%;
}
/*晴朗*/
.img_bg_weather_sunny {
    background: url("./assets/img_bg_weather_sunny.png");
    background-size: 100% 100%;
}
/*雷鸣*/
.img_bg_weather_thuner {
    background: url("./assets/img_bg_weather_thuner.png");
    background-size: 100% 100%;
}
/*刮风*/
.img_bg_weather_wind {
    background: url("./assets/img_bg_weather_wind.png");
    background-size: 100% 100%;
}
.tip {
    position: absolute;
    left: 0;
    top: 120px;
    width: 100%;
    text-align: center;
    font-size: 24px;
    line-height: 24px;
    color: #ffffff;
    font-family: NotoSansHans-DemiLight;
}
.title {
    margin-top: 30px;
    // line-height: 95px;
    height: 95px;
    text-align: center;
    font-size: 36px;
}
.city {
    padding: 40px 0 30px;
    line-height: 42px;
    text-align: center;
    font-size: 42px;
    .city-name {
        font-size: 42px;
        margin: 40px 0;
    }
    .city-detail {
        font-size: 30px;
        i {
            border-radius: 6px;
            font-style: normal;
            color: #333;
            padding: 5px 10px;
        }
        .air-level-1 {
            background: #07fd04;
        }
        .air-level-2 {
            background: #ffff00;
        }
        .air-level-3 {
            background: #ff7805;
        }
        .air-level-4 {
            background: #fa0100;
        }
        .air-level-5 {
            background: #9e004f;
        }
        .air-level-6 {
            background: #790222;
        }
    }
    .img {
        display: inline-block;
        width: 120px;
        height: 120px;
        background-size: 100% 100%;
    }
    .icn_weather_sunny {
        background-image: url("./assets/icn_weather_sunny_l.png");
    }
    .icn_weather_cloudy {
        background-image: url("./assets/icn_weather_cloudy_l.png");
    }
    .icn_weather_mostlycloudy {
        background-image: url("./assets/icn_weather_mostlycloudy_l.png");
    }
    .icn_weather_rainy {
        background-image: url("./assets/icn_weather_rainy_l.png");
    }
    .icn_weather_thuner {
        background-image: url("./assets/icn_weather_thunder_l.png");
    }
    .icn_weather_wind {
        background-image: url("./assets/icn_weather_wind_l.png");
    }
    .icn_weather_snowy {
        background-image: url("./assets/icn_weather_snow_l.png");
    }
}
.weather-list-con {
    padding: 90px 90px 0;
    .weather-list {
        margin: 0;
        text-align: center;
        li {
            list-style: none;
            .w-icon {
                padding: 40px 0;
                i {
                    display: inline-block;
                    height: 60px;
                    width: 60px;
                    background-repeat: no-repeat;
                }
                /*多云*/
                .icn_weather_cloudy_m {
                    background: url("./assets/icn_weather_cloudy_m.png");
                    background-size: 60px 60px;
                }
                /*大雨*/
                .icn_weather_heavyrain_m {
                    background: url("./assets/icn_weather_heavyrain_m.png");
                    background-size: 60px 60px;
                }
                /*小雨*/
                .icn_weather_rainy_m {
                    background: url("./assets/icn_weather_rainy_m.png");
                    background-size: 60px 60px;
                }
                /*大雪*/
                .icn_weather_heavysnow_m {
                    background: url("./assets/icn_weather_heavysnow_m.png");
                    background-size: 60px 60px;
                }
                /*小雪*/
                .icn_weather_snow_m {
                    background: url("./assets/icn_weather_snow_m.png");
                    background-size: 60px 60px;
                }
                /*大部多云 阴天*/
                .icn_weather_mostlycloudy_m {
                    background: url("./assets/icn_weather_mostlycloudy_m.png");
                    background-size: 60px 60px;
                }
                /*晴*/
                .icn_weather_sunny_m {
                    background: url("./assets/icn_weather_sunny_m.png");
                    background-size: 60px 60px;
                }
                /*打雷*/
                .icn_weather_thunder_m {
                    background: url("./assets/icn_weather_thunder_m.png");
                    background-size: 60px 60px;
                }
                /*刮风*/
                .icn_weather_wind_m {
                    background: url("./assets/icn_weather_wind_m.png");
                    background-size: 60px 60px;
                }
            }
            font-size: 30px;
            padding: 12px 0;
            float: left;
            width: 20%;
            margin-left: -1px;
            border-right: 1px solid rgba(255, 255, 255, 0.5);
            // box-shadow: inset -1px 0 0 0 rgba(255,255,255,0.50);
        }
        li:last-of-type {
            border-right: 0;
        }
    }
}
.error_tip {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    .icon {
        width: 240px;
        height: 240px;
        background: url(./assets/icon_net.png) no-repeat center bottom;
        background-size: 232px 210px;
        margin: 380px auto 80px;
    }
    .msg {
        font-size: 30px;
        color: #b4d7f7;
        span {
            color: #fff;
        }
    }
}

/*
切换城市
*/
.switch {
    position: absolute;
    top: 33px;
    right: 24px;
    line-height: 36px;
    width: 168px;
    height: 36px;
    cursor: pointer;
    .s-icon {
        width: 36px;
        height: 36px;
        display: inline-block;
        background-image: url(./assets/icn_switch.png);
    }
    .s-text {
        display: inline-block;
        width: 120px;
        height: 36px;
        font-size: 25px;
        line-height: 36px;
    }
}
</style>

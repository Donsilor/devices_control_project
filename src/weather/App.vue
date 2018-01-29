<template>
    <div id="app" :class="todyClass">
        <div class="title">{{wList.length && wList[0].predictDate}}&nbsp;&nbsp;周一&nbsp;&nbsp;农历十月十二</div>
        <div class="city">
            <div class="city-name">{{city.name}}</div>
            <img src="./assets/icn_weather_cloudy_l.png" width="120" height="120"/>
            <div class="city-name">{{wList.length && wList[0].tempDay}}℃&nbsp;&nbsp;{{wList.length && wList[0].conditionDay}}</div>
            <div class="city-detail">
                <span>降水概率：10%</span>
                <span>湿度：74%</span>
                <span>实时空气质量：<i class="air-level">19&nbsp;优</i></span>
            </div>
        </div>
        <div class="weather-list-con">
            <ul class="weather-list">
                <li v-for="(item, index) in wList">
                    <div class="">{{index === 0 ? '今天' : item.predictDate}}</div>
                    <div class="w-icon"><i :class="renderClass(item.conditionIdDay)"></i></div>
                    <div class="">{{item.tempNight}}～{{item.tempDay}}℃</div>
                    <div class="">{{item.conditionDay}}</div>
                    <div class="">{{item.windDirDay}}&nbsp;{{item.windLevelDay}}级</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import jsonp from 'jsonp'
    import thisJson from './ww.json'
    export default {
        name: 'app',
        data() {
            return {
                city: {
                  name: '广州'
                },
                todyClass: '',
                wList: []
            }
        },
        mounted() {
            let curArr = thisJson.data['forecast']
            this.wList = curArr.slice(0, curArr.length - 1)
            this.renderTodayClass(this.wList[0].conditionIdDay)
//            jsonp('http://www.sojson.com/open/api/weather/json.shtml?city=北京', null, (err, res) => {
//                if(!err && res.errorcode === '0'){
//                    obj.weatherCallBack(res.data)
//                }
//            })
        },
        methods: {
            renderTodayClass (val) {
                switch (val) {
                    case '0':
                        this.todyClass = 'img_bg_weather_sunny'
                        break
                    case '1':
                    case '2':
                        this.todyClass = 'img_bg_weather_cloudy'
                        break
                    case '3':
                    case '7':
                    case '9':
                    case '10':
                        this.todyClass = 'img_bg_weather_rainy'
                        break
                    case '4':
                        this.todyClass = 'img_bg_weather_thuner'
                        break
                    case '20':
                    case '29':
                        this.todyClass = 'img_bg_weather_wind'
                        break
                    case '13':
                    case '14':
                    case '15':
                    case '16':
                    case '17':
                        this.todyClass = 'img_bg_weather_snowy'
                        break
                    default:
                        break
                }
            },
            renderClass (val) {
                let curClass = ''
                switch(val) {
                    case '0':
                        curClass = 'icn_weather_sunny_m'
                        break
                    case '1':
                        curClass = 'icn_weather_cloudy_m'
                        break
                    case '2':
                        curClass = 'icn_weather_mostlycloudy_m'
                        break
                    case '4':
                        curClass = 'icn_weather_thunder_m'
                        break
                    case '3':
                    case '7':
                        curClass = 'icn_weather_rainy_m'
                        break
                    case '9':
                    case '10':
                        curClass = 'icn_weather_heavyrain_m'
                        break
                    case '20':
                    case '29':
                        curClass = 'icn_weather_wind_m'
                        break
                    case '13':
                    case '14':
                    case '15':
                        curClass = 'icn_weather_snow_m'
                        break
                    case '16':
                    case '17':
                        curClass = 'icn_weather_heavysnow_m'
                        break
                    default:
                        break
                }
                return curClass
            }
        }
    }
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
    .img_bg_weather_cloudy{
        background: url('./assets/img_bg_weather_cloudy.png');
        background-size:100% 100%;
    }
    /*下雨*/
    .img_bg_weather_rainy{
        background: url('./assets/img_bg_weather_rainy.png');
        background-size:100% 100%;
    }
    /*下雪*/
    .img_bg_weather_snowy{
        background: url('./assets/img_bg_weather_snowy.png');
        background-size:100% 100%;
    }
    /*晴朗*/
    .img_bg_weather_sunny{
        background: url('./assets/img_bg_weather_sunny.png');
        background-size:100% 100%;
    }
    /*雷鸣*/
    .img_bg_weather_thuner{
        background: url('./assets/img_bg_weather_thuner.png');
        background-size:100% 100%;
    }
    /*刮风*/
    .img_bg_weather_wind{
        background: url('./assets/img_bg_weather_wind.png');
        background-size:100% 100%;
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
    .title{
        line-height: 95px;
        height: 95px;
        text-align: center;
        font-size: 36px;
    }
    .city{
        padding: 40px 0 30px;
        line-height: 42px;
        text-align: center;
        font-size: 42px;
        .city-name{
            font-size: 42px;
            margin: 20px 0;
        }
        .city-detail{
            font-size: 30px;
            .air-level{
                background: #32cb72;
                border-radius: 6px;
                font-style: normal;
                padding: 5px 10px;
            }
        }
    }
    .weather-list-con{
        padding: 50px 90px 0;
        .weather-list{
            margin: 0;
            text-align: center;
            li{
                list-style: none;
                .w-icon{
                    padding:50px 0;
                    i{
                        display: inline-block;
                        height: 60px;
                        width: 60px;
                        background-repeat: no-repeat;
                    }
                    /*多云*/
                    .icn_weather_cloudy_m{
                        background: url('./assets/icn_weather_cloudy_m.png');
                        background-size:60px 60px;
                    }
                    /*大雨*/
                    .icn_weather_heavyrain_m{
                        background: url('./assets/icn_weather_heavyrain_m.png');
                        background-size:60px 60px;
                    }
                    /*小雨*/
                    .icn_weather_rainy_m{
                        background: url('./assets/icn_weather_rainy_m.png');
                        background-size:60px 60px;
                    }
                    /*大雪*/
                    .icn_weather_heavysnow_m{
                        background: url('./assets/icn_weather_heavysnow_m.png');
                        background-size:60px 60px;
                    }
                    /*小雪*/
                    .icn_weather_snow_m{
                        background: url('./assets/icn_weather_snow_m.png');
                        background-size:60px 60px;
                    }
                    /*大部多云*/
                    .icn_weather_mostlycloudy_m{
                        background: url('./assets/icn_weather_mostlycloudy_m.png');
                        background-size:60px 60px;
                    }
                    /*晴*/
                    .icn_weather_sunny_m{
                        background: url('./assets/icn_weather_sunny_m.png');
                        background-size:60px 60px;
                    }
                    /*打雷*/
                    .icn_weather_thunder_m{
                        background: url('./assets/icn_weather_thunder_m.png');
                        background-size:60px 60px;
                    }
                    /*刮风*/
                    .icn_weather_wind_m{
                        background: url('./assets/icn_weather_wind_m.png');
                        background-size:60px 60px;
                    }
                }
                font-size: 30px;
                padding: 12px 0;
                float: left;
                width: 20%;
                margin-left: -1px;
                border-right: 1px solid #fff;
            }
            li:last-of-type{
                border-right: 0;
            }
        }
    }
</style>

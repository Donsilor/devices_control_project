<template>
    <div id="app">
        <div class="title">11月29日&nbsp;&nbsp;周一&nbsp;&nbsp;农历十月十二</div>
        <div class="city">
            <div class="city-name">广州</div>
            <img src="./assets/icn_weather_cloudy_l.png" width="120" height="120"/>
            <div class="city-name">32℃&nbsp;&nbsp;多云</div>
            <div class="city-detail">
                <span>降水概率：10%</span>
                <span>湿度：74%</span>
                <span>实时空气质量：<i class="air-level">19&nbsp;优</i></span>
            </div>
        </div>
        <div class="weather-list-con">
            <ul class="weather-list">
                <li>
                    <div class="">今天<br>周一</div>
                    <div class="w-icon"><i class="w-icon-sunny"></i></div>
                    <div class="">27～33℃</div>
                    <div class="">多云</div>
                    <div class="">无持续风向微风</div>
                </li>
                <li>
                    <div class="">11月30日<br>周二</div>
                    <div class="w-icon"><i class="w-icon-cloudy"></i></div>
                    <div class="">27～33℃</div>
                    <div class="">晴</div>
                    <div class="">无持续风向微风</div>
                </li>
                <li>
                    <div class="">12月1日<br>周三</div>
                    <div class="w-icon"><i class="w-icon-overcast"></i></div>
                    <div class="">27～33℃</div>
                    <div class="">阴天</div>
                    <div class="">无持续风向微风</div>
                </li>
                <li>
                    <div class="">12月2日<br>周四</div>
                    <div class="w-icon"><i class="w-icon-overcast"></i></div>
                    <div class="">27～33℃</div>
                    <div class="">阴天</div>
                    <div class="">无持续风向微风</div>
                </li>
                <li>
                    <div class="">12月3日<br>周五</div>
                    <div class="w-icon"><i class="w-icon-overcast"></i></div>
                    <div class="">27～33℃</div>
                    <div class="">阴天</div>
                    <div class="">无持续风向微风</div>
                </li>
            </ul>
        </div>
    </div>
</template>

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
        background-image: linear-gradient(-180deg, #2499ff 0%, #13d5dc 100%);
        font-family: NotoSansHans-Regular;
    }
    #app {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
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
        padding: 60px 90px;
        .weather-list{
            text-align: center;
            li{
                list-style: none;
                .w-icon{
                    padding:60px 0;
                    i{
                        display: inline-block;
                        height: 60px;
                        width: 60px;
                        background-repeat: no-repeat;
                    }
                    .w-icon-sunny{
                        background: url('./assets/icn_weather_cloudy_m.png');
                        background-size:60px 60px;
                    }
                    .w-icon-cloudy{
                        background: url('./assets/icn_weather_mostlycloudy_m.png');
                        background-size:60px 60px;
                    }
                    .w-icon-overcast{
                        background: url('./assets/icn_weather_snow_m.png');
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
<script>
    import axios from 'axios';
    export default {
        name: 'app',
        data() {
            return {

            }
        },
        mounted() {
            this.$http.jsonp('http://www.sojson.com/open/api/weather/json.shtml?city=%E5%8C%97%E4%BA%AC').then(res => {
                console.log(res)
            });
        },
        methods: {

        }
    }
</script>

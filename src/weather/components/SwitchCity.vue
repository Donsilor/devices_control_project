<template>
    <div class="scbody">

        <div class="nav">
            <span class="back" @click="back"></span>
            <span class="text">切换城市</span>
        </div>

        <div class="sc-city">
            <div class="input">
                <span class="input-ico"></span>
                <input v-model="userinput" placeholder="请输入城市名称搜索" ref="input" />
                <a href="#" class="i-del" v-show="userinput !== ''" @click.prevent="clearUserInput"></a>
            </div>
            <div class="sc-location">
                <span class="location-ico"></span>
                <span class='location-text'>当前城市：&nbsp; {{city.name || ""}}</span>
            </div>

            <div class="sc-line-location"></div>

            <div class="hot-city-text">热门城市</div>
            <div class="city-list">
                <span v-for="(item, index) in hotCities" :key="index" @click="getWeather(item.city_id)" class="sc-hot-city">{{item.name}}</span>
            </div>

            <div>
                <div class="alpha-city-list">
                    <template v-for="(item, index) in filteredAlphaCityList">
                        <div :key="index">
                            <div :id="item.char" class="alpha-title">{{item.char}}</div>
                            <div class="sc-line-location"></div>
                            <template v-for="(child, childindex) in item.list">
                                <div :key="`${index}` + `${childindex}`">
                                    <div class="alpah-city-text" @click="getWeather(child.city_id)">{{child.name}}</div>
                                    <div class="sc-line-location"></div>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <div class="alpha-filter">
            <div class="filter-hot-text" @touchstart="jump">热门</div>
            <div @touchmove.prevent="jump" @touchend.prevent="finishFiler">
                <template v-for="(char, index) in chars">
                    <div :key="index" class="filter-char-box">
                        <span v-if="current_filterchar == char" class="scale-char">
                            <span class="scale-char-text">{{current_filterchar}}</span>
                        </span>
                        <div @touchstart="jump" :class="`alpha-filter-char ${current_filterchar == char ? `active-filter-char` : ``}`">{{char}}</div>
                    </div>
                </template>
            </div>
        </div>

    </div>
</template>
<script>

import { ALPHA_CITIES, HOTCITIES } from './const';

export default {
    data() {
        return {
            success: true,
            chars: [],
            userinput: "",
            filteredAlphaCityList: [],
            alphaCityList: [],
            current_filterchar: ``,
            charScale: false,
            hotCities: []
        };
    },
    mounted() {
        // HdSmart.ready(() => {});
        //TODO 获取热门城市JSON
        //getHotCitylistJSON()
        this.alphaCityList = this.filteredAlphaCityList = this.groupByAlpha(
            ALPHA_CITIES
        );

        this.chars = this.alphaCityList.map(item => item.char);

        this.hotCities = HOTCITIES;

        //iscroll
        // let myScroll = new IScroll("#wrapper", { useTransition: false });
    },

    props: ["getCityWeather", "city"],
    watch: {
        //用户过滤
        userinput(val, oldVal) {
            // change of userinput, do something
            this.alphafilter(val);
        }
    },

    methods: {
        //返回
        back() {
            this.$emit("hideswitch");
        },
        //用户过滤
        alphafilter(val) {
            if (val == "") this.filteredAlphaCityList = this.alphaCityList;
            this.filteredAlphaCityList = this.alphaCityList
                .map(city => {
                    let newItem = Object.assign({}, city, {
                        list: city.list.filter(item => item.name.includes(val))
                    });
                    if (!newItem.list.length) {
                        return null;
                    }
                    return newItem;
                })
                .filter(x => x);
        },
        getWeather(weathercnid) {
            this.back();
            //缓存至下次登陆展示
            localStorage.setItem("weathercnid", weathercnid);
            this.getCityWeather(weathercnid);
        },

        jump(e) {
            //防止滑动时输入法弹出
            this.$refs.input.blur();
            let target = e.touches[0];
            if (target) {
                let fromel = document.elementFromPoint(
                    target.clientX,
                    target.clientY
                );
                //热门处理
                if (fromel && fromel.className === "filter-hot-text") {
                    this.current_filterchar = `${fromel.innerHTML}`;
                    let toel = document.querySelector(`.hot-city-text`);
                    // console.log("toel", toel);
                    if (toel) {
                        toel.scrollIntoView();
                    }
                }
                // console.log("jump", fromel, target.clientX, target.clientY);
                if (
                    fromel &&
                    fromel.className.indexOf("alpha-filter-char") !== -1
                ) {
                    this.current_filterchar = `${fromel.innerHTML}`;
                    let toel = document.querySelector(
                        `.alpha-city-list #${fromel.innerHTML}`
                    );
                    // console.log("toel", toel);
                    if (toel) {
                        toel.scrollIntoView();
                    }
                }
            }
        },
        groupByAlpha(data) {
            let res = [],
                find = function(arr, char) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].char == char) {
                            return arr[i];
                        }
                    }
                    return -1;
                };
            data.forEach(item => {
                item.list.forEach(city => {
                    let firstChar = city["name_py"].charAt(0).toUpperCase(),
                        targetInRes = find(res, firstChar);
                    if (targetInRes && targetInRes !== -1) {
                        targetInRes.list.push(city);
                    } else {
                        res.push({ char: firstChar, list: [city] });
                    }
                });
            });

            res.sort((prev, cur) => {
                if (prev.char < cur.char) {
                    return -1;
                } else if (prev.char > cur.char) {
                    return 1;
                } else {
                    return 0;
                }
            });
            // console.log(res);
            return res;
        },
        finishFiler() {
            this.current_filterchar = "";
        },
        clearUserInput() {
            this.userinput = "";
        }
    }
};
</script>
<style lang="less">
.scbody {
    font-size: 30px;
    font-family: NotoSansHans-Regular;
    padding: 0 50px;
}
.nav {
    height: 96px;
    text-align: center;
    .back {
        position: absolute;
        top: 37px;
        left: 40px;
        width: 36px;
        height: 36px;
        background: url("../../../lib/base/weather/assets/icn_topbar_arrowdown_w_normal.png");
        background-size: 100% 100%;
        display: inline-block;
    }

    .text {
        position: absolute;
        top: 30px;
        width: 144px;
        height: 36px;
        font-size: 36px;
    }
}
.input {
    position: relative;
    height: 72px;
    margin: 11px 0 0 0px;
    background-color: white;
    input {
        display: inline-block;
        height: 72px;
        margin-left: 80px;
        font-size: 30px;
        border: none;
        position: absolute;
        top: 0px;
        padding: 0;
        width: 95%;
        // color: #c8cacc;
        &:focus {
            outline: none;
        }
    }
    .input-ico {
        position: absolute;
        top: 18px;
        left: 24px;
        display: inline-block;
        width: 36px;
        height: 36px;
        background: url("../../../lib/base/weather/assets/icn_topbar_search_pressed.png")
            no-repeat;
        background-size: 100% 100%;
    }
}

.alpha-filter {
    position: fixed;
    top: 50%;
    transform: translate(0, -50%);
    right: 0px;
    z-index: 10;
    .filter-hot-text {
        font-size: 24px;
    }
    .alpha-filter-char {
        text-align: center;
        line-height: 36px;
        vertical-align: middle;
        width: 36px;
        height: 36px;
        margin: 6px 8px 0 10px;
    }

    .active-filter-char {
        background: #ffffff;
        color: #808080;
        border-radius: 50%;
    }

    .filter-char-box {
        position: relative;
    }
}

.scale-char {
    display: inline-block;
    top: -53px;
    right: 45px;
    position: absolute;
    height: 144px;
    width: 144px;
    background: url("../../../lib/base/weather/assets/icn_instructions.png")
        no-repeat;
    background-size: 100% 100%;
    line-height: 144px;
    .scale-char-text {
        font-size: 72px;
        color: #808080;
        width: 120px;
        text-align: center;
        display: block;
    }
}

.sc-hot-city {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    width: 180px;
    height: 54px;
    background-color: white;
    color: #808080;
    font-size: 30px;
    line-height: 54px;
    margin: 0px 60px 54px 0;
    border-radius: 4px;
}

.sc-location {
    margin-top: 84px;
    .location-ico {
        display: inline-block;
        width: 36px;
        height: 36px;
        background: url("../../../lib/base/weather/assets/icn__positioning.png")
            no-repeat;
        background-size: 100% 100%;
    }
    .location-text {
        position: absolute;
        line-height: 36px;
        vertical-align: middle;
        margin-left: 12px;
        width: 590px;
        height: 30px;
    }
}

.sc-line-location {
    margin: 23px 0 0 4px;
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ffffff;
    padding: 0;
    opacity: 0.5;
}

.sc-city {
    padding: 10px;
    margin: 0px 0 0 8px;
    .city-list {
        margin-top: 39px;
    }
}
//iscroll
// #wrapper {
//     position: absolute;
// }
// #scroller {
//     position: absolute;
// }

.alpha-city-list {
    .alpha-title {
        font-size: 36px;
        margin: 33px 0 24px 0;
    }

    .alpah-city-text {
        cursor: pointer;
        margin: 33px 0;
    }
}

.hot-city-text {
    margin: 45px 0 0 0px;
}

.i-del {
    position: absolute;
    width: 40px;
    height: 40px;
    right: 14px;
    top: 17px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(../../../lib/base/weather/assets/btn_input_delete_normal@2x.png);
    &:active {
        background-image: url(../../../lib/base/weather/assets/btn_input_delete_pressed@2x.png);
    }
}
</style>

<template>
    <div class="scbody">
        <div class="fixed" :class="todyClass+2">
            <div class="nav">
                <span class="back" @click="back"></span>
                <span class="text">切换城市</span>
            </div>
            <form class="input" @submit.prevent="onSubmit">
                <span class="input-ico"></span>
                <input v-model="userinput" placeholder="请输入城市名称搜索" ref="input" />
                <a href="#" class="i-del" v-show="userinput !== ''" @click.prevent="clearUserInput"></a>
            </form>
            <div class="sc-location">
                <span class="location-ico"></span>
                <span class='location-text'>当前城市：&nbsp; {{city.name || ""}}</span>
            </div>

            <div class="sc-line-location"></div>
        </div>
        <div class="sc-city">

            <div class="hot-city-text">热门城市</div>
            <div class="city-list">
                <span v-for="(item, index) in hotCities" :key="index" @click="getWeather(item)" class="sc-hot-city">{{item.name}}</span>
            </div>

            <div>
                <div class="alpha-city-list">
                    <template v-for="(item, index) in filteredAlphaCityList">
                        <div :key="index">
                            <div :id="item.char" class="alpha-title">{{item.char}}</div>
                            <div class="sc-line-location"></div>
                            <template v-for="(child, childindex) in item.list">
                                <div :key="`${index}` + `${childindex}`">
                                    <div class="alpah-city-text" @click="getWeather(child)">{{child.name}}</div>
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
import { ALPHA_CITIES, HOTCITIES } from "./const";

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

    props: ["getCityWeather", "city","todyClass"],
    watch: {
        //用户过滤
        userinput(val, oldVal) {
            // change of userinput, do something
            this.alphafilter(val);
        }
    },

    methods: {
        onSubmit(){
            this.$refs.input.blur();
        },
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
        getWeather(item) {
            this.back();
            //缓存至下次登陆展示
            localStorage.setItem("city", JSON.stringify(item));
            setTimeout(() => {
                this.getCityWeather(item);
            }, 150)
        },

        scroll(el, offset=0) {
            var topOfElement = el.offsetTop - offset;
            document.querySelector('#app').scrollTop = topOfElement;
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
                let headerOffset = document.querySelector(`.fixed`).clientHeight || 0
                if (fromel && fromel.className === "filter-hot-text") {
                    this.current_filterchar = `${fromel.innerHTML}`;
                    let toel = document.querySelector(`.hot-city-text`);
                    if (toel) {
                        this.scroll(toel, headerOffset);
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
                    // if (document.querySelector(`.alpha-city-list #${fromel.innerHTML}`)) {
                    //     this.scroll(document.querySelector(
                    //         `.alpha-city-list #${fromel.innerHTML}`
                    //     ), headerOffset);
                    // }
                    if (toel) {
                        this.scroll(toel, headerOffset);
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

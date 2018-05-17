<template>
    <div class="scbody">
        <template v-if="success">
            <div class="nav">
                <span class="back" @click="back"></span>
                <span class="text">切换城市</span>
            </div>
            <div class="input">
                <span class="input-ico"></span>
                <input v-model="userinput" placeholder="请输入城市名称搜索" />
            </div>
            <div class="sc-city">
            <div class="sc-location">
                <span class="location-ico"></span>
                <span class='location-text'>当前定位城市：&nbsp; 深圳</span>
            </div>

            <div class="sc-line-location"></div>

            
                <div class="hot-city-text">热门城市</div>
                <div class="city-list">
                    <span v-for="(item, index) in hotCities" :key="index" @click="getWeather" class="sc-hot-city">{{item.name}}</span>
                </div>
            
            
            <div class="alpha-city-list">
                <template v-for="(item, index) in filteredAlphaCityList">
                    <div :key="index">
                        <div :id="item.char" class="alpha-title">{{item.char}}</div>
                        <div class="sc-line-location"></div>
                        <template v-for="(child, childindex) in item.list">
                            <div :key="childindex">
                                <div class="alpah-city-text" @click="getWeather(child.city_id)" >{{child.name}}</div>
                                <div class="sc-line-location"></div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>

            </div>

            <div class="alpha-filter">
                <div class="filter-hot-text">热门</div>
                <div @touchmove.prevent="jump" @touchend.prevent="finishFiler">
                <template v-for="(char, index) in chars">
                    <div :key="index" class="filter-char-box" >
                        <span v-if="current_filterchar == char" class="scale-char">
                            <span class="scale-char-text">{{current_filterchar}}</span>
                        </span>
                    <div :class="`alpha-filter-char ${current_filterchar == char ? `active-filter-char` : ``}`">{{char}}</div>
                    </div>
                </template>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="error_tip">
                <div class="icon"></div>
                <div class="msg">无法连接网络，请检查网络后 <span>点击屏幕刷新</span></div>
            </div>
        </template>
    </div>
</template>
<script>
const CHARS = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
];

const HOTCITIES = [
    {
        name: "北京"
    },
    {
        name: "上海"
    },
    {
        name: "深圳"
    },
    {
        name: "郑州"
    },
    {
        name: "南京"
    },
    {
        name: "无锡"
    },
    {
        name: "成都"
    },
    {
        name: "广州"
    },
    {
        name: "天津"
    },
    {
        name: "杭州"
    },
    {
        name: "台北"
    },
    {
        name: "宁波"
    },
    {
        name: "武汉"
    },
    {
        name: "乌鲁木齐"
    }
];
const ALPHA_CITIES = [
    {
        list: [
            {
                name_py: "huhehaoteshi",
                weathercnid: "101080101",
                name_en: "Hohhot",
                name: "呼和浩特市",
                city_id: "2036"
            },
            {
                name_py: "baotoushi",
                weathercnid: "101080201",
                name_en: "Baotou",
                name: "包头市",
                city_id: "2044"
            },
            {
                name_py: "wuhaishi",
                weathercnid: "101080301",
                name_en: "Wuhai",
                name: "乌海市",
                city_id: "2051"
            },
            {
                name_py: "chifengshi",
                weathercnid: "101080601",
                name_en: "Chifeng",
                name: "赤峰市",
                city_id: "2054"
            },
            {
                name_py: "tongliaoshi",
                weathercnid: "101080501",
                name_en: "Tongliao",
                name: "通辽市",
                city_id: "2071"
            },
            {
                name_py: "Eerduosishi",
                weathercnid: "101080701",
                name_en: "Ordos",
                name: "鄂尔多斯市",
                city_id: "2084"
            },
            {
                name_py: "hulunbeiershi",
                weathercnid: "101081001",
                name_en: "Hulunbuir",
                name: "呼伦贝尔市",
                city_id: "2097"
            },
            {
                name_py: "manzhoulishi",
                weathercnid: "101081010",
                name_en: "Manzhouli",
                name: "满洲里市",
                city_id: "2099"
            },
            {
                name_py: "yakeshishi",
                weathercnid: "101081011",
                name_en: "Yakeshi",
                name: "牙克石市",
                city_id: "2100"
            },
            {
                name_py: "zhalantunshi",
                weathercnid: "101081012",
                name_en: "Zhalantun",
                name: "扎兰屯市",
                city_id: "2101"
            },
            {
                name_py: "genheshi",
                weathercnid: "101081015",
                name_en: "Genhe",
                name: "根河市",
                city_id: "2102"
            },
            {
                name_py: "Eergunashi",
                weathercnid: "101081014",
                name_en: "Ergun",
                name: "额尔古纳市",
                city_id: "2103"
            },
            {
                name_py: "fengzhenshi",
                weathercnid: "101080412",
                name_en: "Fengzhen",
                name: "丰镇市",
                city_id: "2128"
            },
            {
                name_py: "xilinhaoteshi",
                weathercnid: "101080901",
                name_en: "Xilinhot",
                name: "锡林浩特市",
                city_id: "2140"
            },
            {
                name_py: "erlianhaoteshi",
                weathercnid: "101080903",
                name_en: "Erenhot",
                name: "二连浩特市",
                city_id: "2141"
            },
            {
                name_py: "wulanhaoteshi",
                weathercnid: "101081101",
                name_en: "Ulanhot",
                name: "乌兰浩特市",
                city_id: "2157"
            },
            {
                name_py: "Aershanshi",
                weathercnid: "101081102",
                name_en: "Arxan",
                name: "阿尔山市",
                city_id: "2158"
            },
            {
                name_py: "huolinguoleshi",
                weathercnid: "101080512",
                name_en: "Holingol",
                name: "霍林郭勒市",
                city_id: "2163"
            }
        ],
        name: "内蒙古自治区"
    }
];

export default {
    data() {
        return {
            success: true,
            chars: CHARS || [],
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
        this.hotCities = HOTCITIES;
    },

    props: ["getCityWeather"],
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
        getWeather(city_id) {
            this.getCityWeather(city_id);
        },
        jump(e) {
            let target = e.touches[0];
            if (target) {
                let fromel = document.elementFromPoint(
                    target.clientX,
                    target.clientY
                );
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
            let res = [];
            data.forEach(item => {
                item.list.forEach(city => {
                    let firstChar = city["name_py"].charAt(0).toUpperCase(),
                        targetInRes = res.find(target => {
                            return target.char == firstChar;
                        });
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
        }
    }
};
</script>
<style lang="less">
.scbody {
    font-size: 30px;
    font-family: NotoSansHans-Regular;
}
.nav {
    height: 96px;
    text-align: center;
    .back {
        position: absolute;
        top: 30px;
        left: 70px;
        cursor: pointer;
        width: 54px;
        height: 54px;
        display: inline-block;
        background: url(../assets/icn_topbar_arrowdown_w_normal.png);
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
    width: 1809px;
    margin: 11px 0 0 48px;
    background-color: white;
    input {
        display: inline-block;
        height: 72px;
        width: 1739px;
        margin-left: 80px;
        font-size: 30px;
        border: none;
        position: absolute;
        top: 0px;
        padding: 0;
        // color: #c8cacc;
        &:focus {
            outline: none;
        }
    }
    .input-ico {
        position: absolute;
        top: 11px;
        left: 10px;
        display: inline-block;
        width: 54px;
        height: 54px;
        background-size: 34px 34px;
        background: url("../assets/icn_topbar_search_pressed.png");
    }
}

.alpha-filter {
    position: fixed;
    top: 370px;
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
    background: url("../assets/icn_instructions.png");
    .scale-char-text {
        font-size: 72px;
        color: #808080;
        position: absolute;
        top: 22px;
        left: 35px;
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
        background-size: 36px 36px;
        background: url("../assets/icn__positioning.png");
    }
    .location-text {
        position: absolute;
        line-height: 36px;
        vertical-align: middle;
        margin-left: 12px;
        width: 290px;
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
    width: 1815.5px;
    opacity: 0.5;
}

.sc-city {
    margin: 45px 0 0 48px;
    .city-list {
        margin-top: 39px;
    }
}

.alpha-city-list {
    width: 1815.5px;
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
</style>

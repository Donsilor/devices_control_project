<template>
    <div class="scbody">

        <div class="nav">
            <span class="back" @click="back">返回</span>
            <span class="text">切换城市</span>
        </div>

        <div class="sc-city">
            <div class="input">
                <span class="input-ico"></span>
                <input v-model="userinput" placeholder="请输入城市名称搜索" />
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
                                <div :key="childindex">
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
import IScroll from "iscroll/build/iscroll-lite";

const HOTCITIES = [
    {
        name: "北京",
        city_id: 2
    },
    {
        name: "上海",
        city_id: 39
    },
    {
        name: "深圳",
        city_id: 892
    },
    {
        name: "郑州",
        city_id: 379
    },
    {
        name: "南京",
        city_id: 1045
    },
    {
        name: "无锡",
        city_id: 1061
    },
    {
        name: "成都",
        city_id: 2635
    },
    {
        name: "广州",
        city_id: 886
    },
    {
        name: "天津",
        city_id: 24
    },
    {
        name: "杭州",
        city_id: 1185
    },
    {
        name: "台北",
        city_id: 39
    },
    {
        name: "宁波",
        city_id: 1208
    },
    {
        name: "武汉",
        city_id: 537
    },
    {
        name: "乌鲁木齐",
        city_id: 2505
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
                city_id: 2036
            },
            {
                name_py: "baotoushi",
                weathercnid: "101080201",
                name_en: "Baotou",
                name: "包头市",
                city_id: 2044
            },
            {
                name_py: "wuhaishi",
                weathercnid: "101080301",
                name_en: "Wuhai",
                name: "乌海市",
                city_id: 2051
            },
            {
                name_py: "chifengshi",
                weathercnid: "101080601",
                name_en: "Chifeng",
                name: "赤峰市",
                city_id: 2054
            },
            {
                name_py: "tongliaoshi",
                weathercnid: "101080501",
                name_en: "Tongliao",
                name: "通辽市",
                city_id: 2071
            },
            {
                name_py: "Eerduosishi",
                weathercnid: "101080701",
                name_en: "Ordos",
                name: "鄂尔多斯市",
                city_id: 2084
            },
            {
                name_py: "hulunbeiershi",
                weathercnid: "101081001",
                name_en: "Hulunbuir",
                name: "呼伦贝尔市",
                city_id: 2097
            },
            {
                name_py: "manzhoulishi",
                weathercnid: "101081010",
                name_en: "Manzhouli",
                name: "满洲里市",
                city_id: 2099
            },
            {
                name_py: "yakeshishi",
                weathercnid: "101081011",
                name_en: "Yakeshi",
                name: "牙克石市",
                city_id: 2100
            },
            {
                name_py: "zhalantunshi",
                weathercnid: "101081012",
                name_en: "Zhalantun",
                name: "扎兰屯市",
                city_id: 2101
            },
            {
                name_py: "genheshi",
                weathercnid: "101081015",
                name_en: "Genhe",
                name: "根河市",
                city_id: 2102
            },
            {
                name_py: "Eergunashi",
                weathercnid: "101081014",
                name_en: "Ergun",
                name: "额尔古纳市",
                city_id: 2103
            },
            {
                name_py: "fengzhenshi",
                weathercnid: "101080412",
                name_en: "Fengzhen",
                name: "丰镇市",
                city_id: 2128
            },
            {
                name_py: "xilinhaoteshi",
                weathercnid: "101080901",
                name_en: "Xilinhot",
                name: "锡林浩特市",
                city_id: 2140
            },
            {
                name_py: "erlianhaoteshi",
                weathercnid: "101080903",
                name_en: "Erenhot",
                name: "二连浩特市",
                city_id: 2141
            },
            {
                name_py: "wulanhaoteshi",
                weathercnid: "101081101",
                name_en: "Ulanhot",
                name: "乌兰浩特市",
                city_id: 2157
            },
            {
                name_py: "Aershanshi",
                weathercnid: "101081102",
                name_en: "Arxan",
                name: "阿尔山市",
                city_id: 2158
            },
            {
                name_py: "huolinguoleshi",
                weathercnid: "101080512",
                name_en: "Holingol",
                name: "霍林郭勒市",
                city_id: 2163
            }
        ],
        name: "内蒙古自治区"
    },
    {
        list: [
            {
                name_py: "lasashi",
                weathercnid: "101140101",
                name_en: "Lhasa",
                name: "拉萨市",
                city_id: 3084
            },
            {
                name_py: "changdushi",
                weathercnid: "101140501",
                name_en: "Qamdo",
                name: "昌都市",
                city_id: 3093
            },
            {
                name_py: "rikazeshi",
                weathercnid: "101140201",
                name_en: "Shigatse",
                name: "日喀则市",
                city_id: 3121
            },
            {
                name_py: "linzhishi",
                weathercnid: "101140401",
                name_en: "Nyingchi",
                name: "林芝市",
                city_id: 3164
            }
        ],
        name: "西藏自治区"
    },
    {
        list: [
            {
                name_py: "guiyangshi",
                weathercnid: "101260101",
                name_en: "Guiyang",
                name: "贵阳市",
                city_id: 2982
            },
            {
                name_py: "qingzhenshi",
                weathercnid: "101260108",
                name_en: "Qingzhen",
                name: "清镇市",
                city_id: 2983
            },
            {
                name_py: "liupanshuishi",
                weathercnid: "101260801",
                name_en: "Liupanshui",
                name: "六盘水市",
                city_id: 2994
            },
            {
                name_py: "zunyishi",
                weathercnid: "101260201",
                name_en: "Zunyi",
                name: "遵义市",
                city_id: 3000
            },
            {
                name_py: "chishuishi",
                weathercnid: "101260208",
                name_en: "Chishui",
                name: "赤水市",
                city_id: 3001
            },
            {
                name_py: "renhuaishi",
                weathercnid: "101260203",
                name_en: "Renhuai",
                name: "仁怀市",
                city_id: 3002
            },
            {
                name_py: "anshunshi",
                weathercnid: "101260301",
                name_en: "Anshun",
                name: "安顺市",
                city_id: 3016
            },
            {
                name_py: "tongrenshi",
                weathercnid: "101260601",
                name_en: "Tongren",
                name: "铜仁市",
                city_id: 3023
            },
            {
                name_py: "bijieshi",
                weathercnid: "101260701",
                name_en: "Bijie",
                name: "毕节市",
                city_id: 3034
            },
            {
                name_py: "xingyishi",
                weathercnid: "101260901",
                name_en: "Xingyi",
                name: "兴义市",
                city_id: 3044
            },
            {
                name_py: "kailishi",
                weathercnid: "101260501",
                name_en: "Kaili",
                name: "凯里市",
                city_id: 3053
            },
            {
                name_py: "duyunshi",
                weathercnid: "101260401",
                name_en: "Duyun",
                name: "都匀市",
                city_id: 3070
            },
            {
                name_py: "fuquanshi",
                weathercnid: "101260405",
                name_en: "Fuquan",
                name: "福泉市",
                city_id: 3071
            }
        ],
        name: "贵州省"
    },
    {
        list: [
            {
                name_py: "shijiazhuangshi",
                weathercnid: "101090101",
                name_en: "Shijiazhuang",
                name: "石家庄市",
                city_id: 1742
            },
            {
                name_py: "xinjishi",
                weathercnid: "101090114",
                name_en: "Xinji",
                name: "辛集市",
                city_id: 1744
            },
            {
                name_py: "jinzhoushi",
                weathercnid: "101090116",
                name_en: "Jinzhou, Shijiazhuang",
                name: "晋州市",
                city_id: 1745
            },
            {
                name_py: "xinleshi",
                weathercnid: "101090117",
                name_en: "Xinle",
                name: "新乐市",
                city_id: 1746
            },
            {
                name_py: "tangshanshi",
                weathercnid: "101090501",
                name_en: "Tangshan",
                name: "唐山市",
                city_id: 1761
            },
            {
                name_py: "zunhuashi",
                weathercnid: "101090510",
                name_en: "Zunhua",
                name: "遵化市",
                city_id: 1764
            },
            {
                name_py: "qiananshi",
                weathercnid: "101090511",
                name_en: "Qian'an",
                name: "迁安市",
                city_id: 1765
            },
            {
                name_py: "qinhuangdaoshi",
                weathercnid: "101091101",
                name_en: "Qinhuangdao",
                name: "秦皇岛市",
                city_id: 1773
            },
            {
                name_py: "handanshi",
                weathercnid: "101091001",
                name_en: "Handan",
                name: "邯郸市",
                city_id: 1782
            },
            {
                name_py: "wuanshi",
                weathercnid: "101091016",
                name_en: "Wu'an",
                name: "武安市",
                city_id: 1796
            },
            {
                name_py: "xingtaishi",
                weathercnid: "101090901",
                name_en: "Xingtai",
                name: "邢台市",
                city_id: 1799
            },
            {
                name_py: "nangongshi",
                weathercnid: "101090916",
                name_en: "Nangong",
                name: "南宫市",
                city_id: 1800
            },
            {
                name_py: "shaheshi",
                weathercnid: "101090917",
                name_en: "Shahe",
                name: "沙河市",
                city_id: 1801
            },
            {
                name_py: "baodingshi",
                weathercnid: "101090201",
                name_en: "Baoding",
                name: "保定市",
                city_id: 1819
            },
            {
                name_py: "zhuozhoushi",
                weathercnid: "101090218",
                name_en: "Zhuozhou",
                name: "涿州市",
                city_id: 1820
            },
            {
                name_py: "dingzhoushi",
                weathercnid: "101090219",
                name_en: "Dingzhou",
                name: "定州市",
                city_id: 1821
            },
            {
                name_py: "anguoshi",
                weathercnid: "101090220",
                name_en: "Anguo",
                name: "安国市",
                city_id: 1822
            },
            {
                name_py: "gaobeidianshi",
                weathercnid: "101090221",
                name_en: "Gaobeidian",
                name: "高碑店市",
                city_id: 1823
            },
            {
                name_py: "zhangjiakoushi",
                weathercnid: "101090301",
                name_en: "Zhangjiakou",
                name: "张家口市",
                city_id: 1844
            },
            {
                name_py: "chengdeshi",
                weathercnid: "101090402",
                name_en: "Chengde",
                name: "承德市",
                city_id: 1859
            },
            {
                name_py: "cangzhoushi",
                weathercnid: "101090701",
                name_en: "Cangzhou",
                name: "沧州市",
                city_id: 1869
            },
            {
                name_py: "botoushi",
                weathercnid: "101090711",
                name_en: "Botou",
                name: "泊头市",
                city_id: 1870
            },
            {
                name_py: "renqiushi",
                weathercnid: "101090712",
                name_en: "Renqiu",
                name: "任丘市",
                city_id: 1871
            },
            {
                name_py: "huanghuashi",
                weathercnid: "101090713",
                name_en: "Huanghua",
                name: "黄骅市",
                city_id: 1872
            },
            {
                name_py: "hejianshi",
                weathercnid: "101090714",
                name_en: "Hejian",
                name: "河间市",
                city_id: 1873
            },
            {
                name_py: "langfangshi",
                weathercnid: "101090601",
                name_en: "Langfang",
                name: "廊坊市",
                city_id: 1886
            },
            {
                name_py: "bazhoushi",
                weathercnid: "101090608",
                name_en: "Bazhou",
                name: "霸州市",
                city_id: 1887
            },
            {
                name_py: "sanheshi",
                weathercnid: "101090609",
                name_en: "Sanhe",
                name: "三河市",
                city_id: 1888
            },
            {
                name_py: "hengshuishi",
                weathercnid: "101090801",
                name_en: "Hengshui",
                name: "衡水市",
                city_id: 1896
            },
            {
                name_py: "jizhoushi",
                weathercnid: "101090810",
                name_en: "Jizhou",
                name: "冀州市",
                city_id: 1897
            },
            {
                name_py: "shenzhoushi",
                weathercnid: "101090811",
                name_en: "Shenzhou",
                name: "深州市",
                city_id: 1898
            }
        ],
        name: "河北省"
    },
    {
        list: [
            {
                name_py: "beijingshi",
                weathercnid: "101010100",
                name_en: "Beijing",
                name: "北京市",
                city_id: 2
            }
        ],
        name: "北京市"
    },
    {
        list: [
            {
                name_py: "jinanshi",
                weathercnid: "101120101",
                name_en: "Jinan",
                name: "济南市",
                city_id: 1399
            },
            {
                name_py: "zhangqiushi",
                weathercnid: "101120104",
                name_en: "Zhangqiu",
                name: "章丘市",
                city_id: 1401
            },
            {
                name_py: "qingdaoshi",
                weathercnid: "101120201",
                name_en: "Qingdao",
                name: "青岛市",
                city_id: 1407
            },
            {
                name_py: "jiaozhoushi",
                weathercnid: "101120205",
                name_en: "Jiaozhou",
                name: "胶州市",
                city_id: 1408
            },
            {
                name_py: "jimoshi",
                weathercnid: "101120204",
                name_en: "Jimo",
                name: "即墨市",
                city_id: 1409
            },
            {
                name_py: "pingdushi",
                weathercnid: "101120208",
                name_en: "Pingdu",
                name: "平度市",
                city_id: 1410
            },
            {
                name_py: "jiaonanshi",
                weathercnid: "101120206",
                name_en: "Jiaonan",
                name: "胶南市（现黄岛区）",
                city_id: 1411
            },
            {
                name_py: "laixishi",
                weathercnid: "101120207",
                name_en: "Laixi",
                name: "莱西市",
                city_id: 1412
            },
            {
                name_py: "ziboshi",
                weathercnid: "101120301",
                name_en: "Zibo",
                name: "淄博市",
                city_id: 1415
            },
            {
                name_py: "zaozhuangshi",
                weathercnid: "101121401",
                name_en: "Zaozhuang",
                name: "枣庄市",
                city_id: 1425
            },
            {
                name_py: "tengzhoushi",
                weathercnid: "101121405",
                name_en: "Tengzhou",
                name: "滕州市",
                city_id: 1430
            },
            {
                name_py: "dongyingshi",
                weathercnid: "101121201",
                name_en: "Dongying",
                name: "东营市",
                city_id: 1433
            },
            {
                name_py: "yantaishi",
                weathercnid: "101120501",
                name_en: "Yantai",
                name: "烟台市",
                city_id: 1439
            },
            {
                name_py: "longkoushi",
                weathercnid: "101120505",
                name_en: "Longkou",
                name: "龙口市",
                city_id: 1443
            },
            {
                name_py: "laiyangshi",
                weathercnid: "101120510",
                name_en: "Laiyang",
                name: "莱阳市",
                city_id: 1444
            },
            {
                name_py: "laizhoushi",
                weathercnid: "101120502",
                name_en: "Laizhou",
                name: "莱州市",
                city_id: 1445
            },
            {
                name_py: "penglaishi",
                weathercnid: "101120504",
                name_en: "Penglai",
                name: "蓬莱市",
                city_id: 1446
            },
            {
                name_py: "zhaoyuanshi",
                weathercnid: "101120506",
                name_en: "Zhaoyuan, Yantai",
                name: "招远市",
                city_id: 1447
            },
            {
                name_py: "xixiashi",
                weathercnid: "101120507",
                name_en: "Qixia",
                name: "栖霞市",
                city_id: 1448
            },
            {
                name_py: "haiyangshi",
                weathercnid: "101120511",
                name_en: "Haiyang",
                name: "海阳市",
                city_id: 1449
            },
            {
                name_py: "weifangshi",
                weathercnid: "101120601",
                name_en: "Weifang",
                name: "潍坊市",
                city_id: 1452
            },
            {
                name_py: "qingzhoushi",
                weathercnid: "101120602",
                name_en: "Qingzhou",
                name: "青州市",
                city_id: 1454
            },
            {
                name_py: "zhuchengshi",
                weathercnid: "101120609",
                name_en: "Zhucheng",
                name: "诸城市",
                city_id: 1455
            },
            {
                name_py: "shouguangshi",
                weathercnid: "101120603",
                name_en: "Shouguang",
                name: "寿光市",
                city_id: 1456
            },
            {
                name_py: "anqiushi",
                weathercnid: "101120607",
                name_en: "Anqiu",
                name: "安丘市",
                city_id: 1457
            },
            {
                name_py: "gaomishi",
                weathercnid: "101120608",
                name_en: "Gaomi",
                name: "高密市",
                city_id: 1458
            },
            {
                name_py: "changyishi",
                weathercnid: "101120606",
                name_en: "Changyi",
                name: "昌邑市",
                city_id: 1459
            },
            {
                name_py: "weihaishi",
                weathercnid: "101121301",
                name_en: "Weihai",
                name: "威海市",
                city_id: 1463
            },
            {
                name_py: "rushanshi",
                weathercnid: "101121304",
                name_en: "Rushan",
                name: "乳山市",
                city_id: 1465
            },
            {
                name_py: "rongchengshi",
                weathercnid: "101121303",
                name_en: "Rongcheng",
                name: "荣成市",
                city_id: 1466
            },
            {
                name_py: "jiningshi",
                weathercnid: "101120701",
                name_en: "Jining",
                name: "济宁市",
                city_id: 1470
            },
            {
                name_py: "qufushi",
                weathercnid: "101120710",
                name_en: "Qufu",
                name: "曲阜市",
                city_id: 1471
            },
            {
                name_py: "zouchengshi",
                weathercnid: "101120711",
                name_en: "Zoucheng",
                name: "邹城市",
                city_id: 1473
            },
            {
                name_py: "taianshi",
                weathercnid: "101120801",
                name_en: "Taian",
                name: "泰安市",
                city_id: 1482
            },
            {
                name_py: "xintaishi",
                weathercnid: "101120802",
                name_en: "Xintai",
                name: "新泰市",
                city_id: 1483
            },
            {
                name_py: "feichengshi",
                weathercnid: "101120804",
                name_en: "Feicheng",
                name: "肥城市",
                city_id: 1484
            },
            {
                name_py: "rizhaoshi",
                weathercnid: "101121501",
                name_en: "Rizhao",
                name: "日照市",
                city_id: 1489
            },
            {
                name_py: "laiwushi",
                weathercnid: "101121601",
                name_en: "Laiwu",
                name: "莱芜市",
                city_id: 1493
            },
            {
                name_py: "linyishi",
                weathercnid: "101120901",
                name_en: "Linyi",
                name: "临沂市",
                city_id: 1495
            },
            {
                name_py: "dezhoushi",
                weathercnid: "101120401",
                name_en: "Dezhou",
                name: "德州市",
                city_id: 1506
            },
            {
                name_py: "lelingshi",
                weathercnid: "101120406",
                name_en: "Laoling",
                name: "乐陵市",
                city_id: 1507
            },
            {
                name_py: "yuchengshi",
                weathercnid: "101120411",
                name_en: "Yucheng City",
                name: "禹城市",
                city_id: 1508
            },
            {
                name_py: "liaochengshi",
                weathercnid: "101121701",
                name_en: "Liaocheng",
                name: "聊城市",
                city_id: 1518
            },
            {
                name_py: "linqingshi",
                weathercnid: "101121707",
                name_en: "Linqing",
                name: "临清市",
                city_id: 1519
            },
            {
                name_py: "binzhoushi",
                weathercnid: "101121101",
                name_en: "Binzhou",
                name: "滨州市",
                city_id: 1528
            },
            {
                name_py: "hezeshi",
                weathercnid: "101121001",
                name_en: "Heze",
                name: "菏泽市",
                city_id: 1536
            }
        ],
        name: "山东省"
    },
    {
        list: [
            {
                name_py: "zhengzhoushi",
                weathercnid: "101180101",
                name_en: "Zhengzhou",
                name: "郑州市",
                city_id: 379
            },
            {
                name_py: "xinzhengshi",
                weathercnid: "101180106",
                name_en: "Xinzheng",
                name: "新郑市",
                city_id: 381
            },
            {
                name_py: "xingyangshi",
                weathercnid: "101180103",
                name_en: "Xingyang",
                name: "荥阳市",
                city_id: 382
            },
            {
                name_py: "xinmishi",
                weathercnid: "101180105",
                name_en: "Xinmi",
                name: "新密市",
                city_id: 383
            },
            {
                name_py: "gongyishi",
                weathercnid: "101180102",
                name_en: "Gongyi",
                name: "巩义市",
                city_id: 384
            },
            {
                name_py: "dengfengshi",
                weathercnid: "101180104",
                name_en: "Dengfeng",
                name: "登封市",
                city_id: 385
            },
            {
                name_py: "kaifengshi",
                weathercnid: "101180801",
                name_en: "Kaifeng",
                name: "开封市",
                city_id: 388
            },
            {
                name_py: "luoyangshi",
                weathercnid: "101180901",
                name_en: "Luoyang",
                name: "洛阳市",
                city_id: 394
            },
            {
                name_py: "yanshishi",
                weathercnid: "101180908",
                name_en: "Yanshi",
                name: "偃师市",
                city_id: 397
            },
            {
                name_py: "pingdingshanshi",
                weathercnid: "101180501",
                name_en: "Pingdingshan",
                name: "平顶山市",
                city_id: 407
            },
            {
                name_py: "wugangshi",
                weathercnid: "101180506",
                name_en: "Wugang, Pingdingshan",
                name: "舞钢市",
                city_id: 408
            },
            {
                name_py: "ruzhoushi",
                weathercnid: "101180504",
                name_en: "Ruzhou",
                name: "汝州市",
                city_id: 409
            },
            {
                name_py: "jiaozuoshi",
                weathercnid: "101181101",
                name_en: "Jiaozuo",
                name: "焦作市",
                city_id: 416
            },
            {
                name_py: "qinyangshi",
                weathercnid: "101181104",
                name_en: "Qinyang",
                name: "沁阳市",
                city_id: 419
            },
            {
                name_py: "mengzhoushi",
                weathercnid: "101181108",
                name_en: "Mengzhou",
                name: "孟州市",
                city_id: 420
            },
            {
                name_py: "hebishi",
                weathercnid: "101181201",
                name_en: "Hebi",
                name: "鹤壁市",
                city_id: 426
            },
            {
                name_py: "xinxiangshi",
                weathercnid: "101180301",
                name_en: "Xinxiang",
                name: "新乡市",
                city_id: 433
            },
            {
                name_py: "weihuishi",
                weathercnid: "101180305",
                name_en: "Weihui",
                name: "卫辉市",
                city_id: 435
            },
            {
                name_py: "huixianshi",
                weathercnid: "101180304",
                name_en: "Huixian",
                name: "辉县市",
                city_id: 436
            },
            {
                name_py: "anyangshi",
                weathercnid: "101180201",
                name_en: "Anyang",
                name: "安阳市",
                city_id: 443
            },
            {
                name_py: "linzhoushi",
                weathercnid: "101180205",
                name_en: "Linzhou",
                name: "林州市",
                city_id: 444
            },
            {
                name_py: "puyangshi",
                weathercnid: "101181301",
                name_en: "Puyang",
                name: "濮阳市",
                city_id: 449
            },
            {
                name_py: "xuchangshi",
                weathercnid: "101180401",
                name_en: "Xuchang",
                name: "许昌市",
                city_id: 456
            },
            {
                name_py: "yuzhoushi",
                weathercnid: "101180405",
                name_en: "Yuzhou",
                name: "禹州市",
                city_id: 458
            },
            {
                name_py: "changgeshi",
                weathercnid: "101180404",
                name_en: "Changge",
                name: "长葛市",
                city_id: 459
            },
            {
                name_py: "luoheshi",
                weathercnid: "101181501",
                name_en: "Luohe",
                name: "漯河市",
                city_id: 464
            },
            {
                name_py: "sanmenxiashi",
                weathercnid: "101181701",
                name_en: "Sanmenxia",
                name: "三门峡市",
                city_id: 469
            },
            {
                name_py: "yimashi",
                weathercnid: "101181705",
                name_en: "Yima",
                name: "义马市",
                city_id: 470
            },
            {
                name_py: "lingbaoshi",
                weathercnid: "101181702",
                name_en: "Lingbao",
                name: "灵宝市",
                city_id: 471
            },
            {
                name_py: "nanyangshi",
                weathercnid: "101180701",
                name_en: "Nanyang",
                name: "南阳市",
                city_id: 476
            },
            {
                name_py: "dengzhoushi",
                weathercnid: "101180711",
                name_en: "Dengzhou",
                name: "邓州市",
                city_id: 477
            },
            {
                name_py: "shangqiushi",
                weathercnid: "101181001",
                name_en: "Shangqiu",
                name: "商丘市",
                city_id: 489
            },
            {
                name_py: "yongchengshi",
                weathercnid: "101181009",
                name_en: "Yongcheng",
                name: "永城市",
                city_id: 492
            },
            {
                name_py: "xinyangshi",
                weathercnid: "101180601",
                name_en: "Xinyang",
                name: "信阳市",
                city_id: 500
            },
            {
                name_py: "zhoukoushi",
                weathercnid: "101181401",
                name_en: "Zhoukou",
                name: "周口市",
                city_id: 511
            },
            {
                name_py: "xiangchengshi",
                weathercnid: "101181407",
                name_en: "Xiangcheng",
                name: "项城市",
                city_id: 513
            },
            {
                name_py: "zhumadianshi",
                weathercnid: "101181601",
                name_en: "Zhumadian",
                name: "驻马店市",
                city_id: 523
            },
            {
                name_py: "jiyuanshi",
                weathercnid: "101181801",
                name_en: "Jiyuan",
                name: "济源市",
                city_id: 534
            }
        ],
        name: "河南省"
    },
    {
        list: [
            {
                name_py: "nanningshi",
                weathercnid: "101300101",
                name_en: "Nanning",
                name: "南宁市",
                city_id: 776
            },
            {
                name_py: "liuzhoushi",
                weathercnid: "101300301",
                name_en: "Liuzhou",
                name: "柳州市",
                city_id: 787
            },
            {
                name_py: "guilinshi",
                weathercnid: "101300501",
                name_en: "Guilin",
                name: "桂林市",
                city_id: 795
            },
            {
                name_py: "wuzhoushi",
                weathercnid: "101300601",
                name_en: "Wuzhou",
                name: "梧州市",
                city_id: 809
            },
            {
                name_py: "cenxishi",
                weathercnid: "101300606",
                name_en: "Cenxi",
                name: "岑溪市",
                city_id: 810
            },
            {
                name_py: "beihaishi",
                weathercnid: "101301301",
                name_en: "Beihai",
                name: "北海市",
                city_id: 816
            },
            {
                name_py: "fangchenggangshi",
                weathercnid: "101301401",
                name_en: "Fangchenggang",
                name: "防城港市",
                city_id: 822
            },
            {
                name_py: "dongxingshi",
                weathercnid: "101301403",
                name_en: "Dongxing",
                name: "东兴市",
                city_id: 823
            },
            {
                name_py: "hezhoushi",
                weathercnid: "101300701",
                name_en: "Hezhou",
                name: "贺州市",
                city_id: 825
            },
            {
                name_py: "laibinshi",
                weathercnid: "101300401",
                name_en: "Laibin",
                name: "来宾市",
                city_id: 830
            },
            {
                name_py: "heshanshi",
                weathercnid: "101300406",
                name_en: "Heshan, Laibin",
                name: "合山市",
                city_id: 831
            },
            {
                name_py: "guigangshi",
                weathercnid: "101300801",
                name_en: "Guigang",
                name: "贵港市",
                city_id: 837
            },
            {
                name_py: "guipingshi",
                weathercnid: "101300802",
                name_en: "Guiping",
                name: "桂平市",
                city_id: 838
            },
            {
                name_py: "yulinshi",
                weathercnid: "101300901",
                name_en: "Yulin",
                name: "玉林市",
                city_id: 841
            },
            {
                name_py: "beiliushi",
                weathercnid: "101300903",
                name_en: "Beiliu",
                name: "北流市",
                city_id: 842
            },
            {
                name_py: "baiseshi",
                weathercnid: "101301001",
                name_en: "Baise",
                name: "百色市",
                city_id: 848
            },
            {
                name_py: "jingxishi",
                weathercnid: "101301005",
                name_en: "Jingxi",
                name: "靖西市",
                city_id: 856
            },
            {
                name_py: "hechishi",
                weathercnid: "101301201",
                name_en: "Hechi",
                name: "河池市",
                city_id: 861
            },
            {
                name_py: "yizhoushi",
                weathercnid: "101301207",
                name_en: "Yizhou",
                name: "宜州市",
                city_id: 862
            },
            {
                name_py: "qinzhoushi",
                weathercnid: "101301101",
                name_en: "Qinzhou",
                name: "钦州市",
                city_id: 873
            },
            {
                name_py: "chongzuoshi",
                weathercnid: "101300201",
                name_en: "Chongzuo",
                name: "崇左市",
                city_id: 877
            },
            {
                name_py: "pingxiangshi",
                weathercnid: "101300204",
                name_en: "Pingxiang, Chongzuo",
                name: "凭祥市",
                city_id: 883
            }
        ],
        name: "广西壮族自治区"
    },
    {
        list: [
            {
                name_py: "wulumuqishi",
                weathercnid: "101130101",
                name_en: "Urumqi",
                name: "乌鲁木齐市",
                city_id: 2505
            },
            {
                name_py: "kelamayishi",
                weathercnid: "101130201",
                name_en: "Karamay",
                name: "克拉玛依市",
                city_id: 2516
            },
            {
                name_py: "shihezishi",
                weathercnid: "101130301",
                name_en: "Shihezi",
                name: "石河子市",
                city_id: 2520
            },
            {
                name_py: "mosuowanshi",
                weathercnid: "101130303",
                name_en: "Mosuowan",
                name: "莫索湾市",
                city_id: 2521
            },
            {
                name_py: "Alaershi",
                weathercnid: "101130701",
                name_en: "Alar",
                name: "阿拉尔市",
                city_id: 2525
            },
            {
                name_py: "Alashankoushi",
                weathercnid: "101131606",
                name_en: "Alatavighizi",
                name: "阿拉山口市",
                city_id: 2529
            },
            {
                name_py: "Atushishi",
                weathercnid: "101131501",
                name_en: "Artux",
                name: "阿图什市",
                city_id: 2575
            },
            {
                name_py: "kuerleshi",
                weathercnid: "101130601",
                name_en: "Korla",
                name: "库尔勒市",
                city_id: 2581
            },
            {
                name_py: "fukangshi",
                weathercnid: "101130404",
                name_en: "Fukang",
                name: "阜康市",
                city_id: 2596
            },
            {
                name_py: "yiningshi",
                weathercnid: "101131001",
                name_en: "Gulja (Qulja)",
                name: "伊宁市",
                city_id: 2605
            },
            {
                name_py: "wusushi",
                weathercnid: "101131106",
                name_en: "Sixw",
                name: "乌苏市",
                city_id: 2618
            },
            {
                name_py: "tulufanshi",
                weathercnid: "101130501",
                name_en: "Turpan",
                name: "吐鲁番市",
                city_id: 285319
            },
            {
                name_py: "hamishi",
                weathercnid: "101131201",
                name_en: "Hami",
                name: "哈密市",
                city_id: 285320
            },
            {
                name_py: "changjishi",
                weathercnid: "101130401",
                name_en: "Changji",
                name: "昌吉市",
                city_id: 285321
            },
            {
                name_py: "Akesushi",
                weathercnid: "101130801",
                name_en: "Aksu",
                name: "阿克苏市",
                city_id: 285324
            },
            {
                name_py: "kashishi",
                weathercnid: "101130901",
                name_en: "Kashgar",
                name: "喀什市",
                city_id: 285325
            },
            {
                name_py: "hetianshi",
                weathercnid: "101131301",
                name_en: "Hotan",
                name: "和田市",
                city_id: 285326
            },
            {
                name_py: "tachengshi",
                weathercnid: "101131101",
                name_en: "Qoqek (Chöchek) / Sawesek",
                name: "塔城市",
                city_id: 285329
            }
        ],
        name: "新疆维吾尔自治区"
    },
    {
        list: [
            {
                name_py: "fuzhoushi",
                weathercnid: "101230101",
                name_en: "Fuzhou",
                name: "福州市",
                city_id: 1654
            },
            {
                name_py: "fuqingshi",
                weathercnid: "101230111",
                name_en: "Fuqing",
                name: "福清市",
                city_id: 1655
            },
            {
                name_py: "changleshi",
                weathercnid: "101230110",
                name_en: "Changle",
                name: "长乐市",
                city_id: 1656
            },
            {
                name_py: "xiamenshi",
                weathercnid: "101230201",
                name_en: "Xiamen",
                name: "厦门市",
                city_id: 1665
            },
            {
                name_py: "putianshi",
                weathercnid: "101230401",
                name_en: "Putian",
                name: "莆田市",
                city_id: 1668
            },
            {
                name_py: "quanzhoushi",
                weathercnid: "101230501",
                name_en: "Quanzhou",
                name: "泉州市",
                city_id: 1677
            },
            {
                name_py: "shishishi",
                weathercnid: "101230510",
                name_en: "Shishi",
                name: "石狮市",
                city_id: 1678
            },
            {
                name_py: "jinjiangshi",
                weathercnid: "101230509",
                name_en: "Jinjiang",
                name: "晋江市",
                city_id: 1679
            },
            {
                name_py: "nananshi",
                weathercnid: "101230506",
                name_en: "Nan'an",
                name: "南安市",
                city_id: 1680
            },
            {
                name_py: "zhangzhoushi",
                weathercnid: "101230601",
                name_en: "Zhangzhou",
                name: "漳州市",
                city_id: 1689
            },
            {
                name_py: "longhaishi",
                weathercnid: "101230605",
                name_en: "Longhai",
                name: "龙海市",
                city_id: 1690
            },
            {
                name_py: "nanpingshi",
                weathercnid: "101230901",
                name_en: "Nanping",
                name: "南平市",
                city_id: 1700
            },
            {
                name_py: "shaowushi",
                weathercnid: "101230904",
                name_en: "Shaowu",
                name: "邵武市",
                city_id: 1701
            },
            {
                name_py: "wuyishanshi",
                weathercnid: "101230905",
                name_en: "Wuyishan",
                name: "武夷山市",
                city_id: 1702
            },
            {
                name_py: "jianoushi",
                weathercnid: "101230910",
                name_en: "Jian'ou",
                name: "建瓯市",
                city_id: 1703
            },
            {
                name_py: "longyanshi",
                weathercnid: "101230701",
                name_en: "Longyan",
                name: "龙岩市",
                city_id: 1711
            },
            {
                name_py: "zhangpingshi",
                weathercnid: "101230707",
                name_en: "Zhangping",
                name: "漳平市",
                city_id: 1712
            },
            {
                name_py: "sanmingshi",
                weathercnid: "101230801",
                name_en: "Sanming",
                name: "三明市",
                city_id: 1719
            },
            {
                name_py: "yonganshi",
                weathercnid: "101230810",
                name_en: "Yong'an",
                name: "永安市",
                city_id: 1720
            },
            {
                name_py: "ningdeshi",
                weathercnid: "101230301",
                name_en: "Ningde",
                name: "宁德市",
                city_id: 1731
            },
            {
                name_py: "fuanshi",
                weathercnid: "101230306",
                name_en: "Fu'an",
                name: "福安市",
                city_id: 1732
            },
            {
                name_py: "fudingshi",
                weathercnid: "101230308",
                name_en: "Fuding",
                name: "福鼎市",
                city_id: 1733
            }
        ],
        name: "福建省"
    },
    {
        list: [
            {
                name_py: "changchunshi",
                weathercnid: "101060101",
                name_en: "Changchun",
                name: "长春市",
                city_id: 182
            },
            {
                name_py: "yushushi",
                weathercnid: "101060105",
                name_en: "Yushu, Changchun",
                name: "榆树市",
                city_id: 185
            },
            {
                name_py: "dehuishi",
                weathercnid: "101060103",
                name_en: "Dehui",
                name: "德惠市",
                city_id: 186
            },
            {
                name_py: "jilinshi",
                weathercnid: "101060201",
                name_en: "Jilin",
                name: "吉林市",
                city_id: 189
            },
            {
                name_py: "shulanshi",
                weathercnid: "101060202",
                name_en: "Shulan",
                name: "舒兰市",
                city_id: 190
            },
            {
                name_py: "huadianshi",
                weathercnid: "101060206",
                name_en: "Huadian",
                name: "桦甸市",
                city_id: 191
            },
            {
                name_py: "jiaoheshi",
                weathercnid: "101060204",
                name_en: "Jiaohe",
                name: "蛟河市",
                city_id: 192
            },
            {
                name_py: "panshishi",
                weathercnid: "101060205",
                name_en: "Panshi",
                name: "磐石市",
                city_id: 193
            },
            {
                name_py: "sipingshi",
                weathercnid: "101060401",
                name_en: "Siping",
                name: "四平市",
                city_id: 197
            },
            {
                name_py: "gongzhulingshi",
                weathercnid: "101060404",
                name_en: "Gongzhuling",
                name: "公主岭市",
                city_id: 198
            },
            {
                name_py: "shuangliaoshi",
                weathercnid: "101060402",
                name_en: "Shuangliao",
                name: "双辽市",
                city_id: 199
            },
            {
                name_py: "liaoyuanshi",
                weathercnid: "101060701",
                name_en: "Liaoyuan",
                name: "辽源市",
                city_id: 204
            },
            {
                name_py: "tonghuashi",
                weathercnid: "101060501",
                name_en: "Tonghua",
                name: "通化市",
                city_id: 208
            },
            {
                name_py: "meihekoushi",
                weathercnid: "101060502",
                name_en: "Meihekou",
                name: "梅河口市",
                city_id: 209
            },
            {
                name_py: "jianshi",
                weathercnid: "101060505",
                name_en: "Ji'an",
                name: "集安市",
                city_id: 210
            },
            {
                name_py: "baishanshi",
                weathercnid: "101060901",
                name_en: "Baishan",
                name: "白山市",
                city_id: 215
            },
            {
                name_py: "linjiangshi",
                weathercnid: "101060903",
                name_en: "Linjiang",
                name: "临江市",
                city_id: 220
            },
            {
                name_py: "baichengshi",
                weathercnid: "101060601",
                name_en: "Baicheng",
                name: "白城市",
                city_id: 223
            },
            {
                name_py: "taonanshi",
                weathercnid: "101060602",
                name_en: "Taonan",
                name: "洮南市",
                city_id: 224
            },
            {
                name_py: "daanshi",
                weathercnid: "101060603",
                name_en: "Daan",
                name: "大安市",
                city_id: 225
            },
            {
                name_py: "songyuanshi",
                weathercnid: "101060801",
                name_en: "Songyuan",
                name: "松原市",
                city_id: 229
            },
            {
                name_py: "fuyushi",
                weathercnid: "101060805",
                name_en: "Fuyu",
                name: "扶余市",
                city_id: 231
            },
            {
                name_py: "yanjishi",
                weathercnid: "101060301",
                name_en: "Yanji",
                name: "延吉市",
                city_id: 237
            },
            {
                name_py: "tumenshi",
                weathercnid: "101060309",
                name_en: "Tumen",
                name: "图们市",
                city_id: 238
            },
            {
                name_py: "dunhuashi",
                weathercnid: "101060302",
                name_en: "Dunhua",
                name: "敦化市",
                city_id: 239
            },
            {
                name_py: "longjingshi",
                weathercnid: "101060307",
                name_en: "Longjing",
                name: "龙井市",
                city_id: 240
            },
            {
                name_py: "hunchunshi",
                weathercnid: "101060308",
                name_en: "Hunchun",
                name: "珲春市",
                city_id: 241
            },
            {
                name_py: "helongshi",
                weathercnid: "101060305",
                name_en: "Helong",
                name: "和龙市",
                city_id: 242
            }
        ],
        name: "吉林省"
    },
    {
        list: [
            {
                name_py: "nanchangshi",
                weathercnid: "101240101",
                name_en: "Nanchang",
                name: "南昌市",
                city_id: 1286
            },
            {
                name_py: "lepingshi",
                weathercnid: "101240802",
                name_en: "Leping",
                name: "乐平市",
                city_id: 1293
            },
            {
                name_py: "jingdezhenshi",
                weathercnid: "101240801",
                name_en: "Jingdezhen",
                name: "景德镇市",
                city_id: 1295
            },
            {
                name_py: "pingxiangshi",
                weathercnid: "101240901",
                name_en: "Pingxiang, Jiangxi",
                name: "萍乡市",
                city_id: 1297
            },
            {
                name_py: "jiujiangshi",
                weathercnid: "101240201",
                name_en: "Jiujiang",
                name: "九江市",
                city_id: 1306
            },
            {
                name_py: "ruichangshi",
                weathercnid: "101240202",
                name_en: "Ruichang",
                name: "瑞昌市",
                city_id: 1316
            },
            {
                name_py: "xinyushi",
                weathercnid: "101241001",
                name_en: "Xinyu",
                name: "新余市",
                city_id: 1318
            },
            {
                name_py: "yingtanshi",
                weathercnid: "101241101",
                name_en: "Yingtan",
                name: "鹰潭市",
                city_id: 1321
            },
            {
                name_py: "guixishi",
                weathercnid: "101241103",
                name_en: "Guixi",
                name: "贵溪市",
                city_id: 1322
            },
            {
                name_py: "ganzhoushi",
                weathercnid: "101240701",
                name_en: "Ganzhou",
                name: "赣州市",
                city_id: 1325
            },
            {
                name_py: "ruijinshi",
                weathercnid: "101240709",
                name_en: "Ruijin",
                name: "瑞金市",
                city_id: 1326
            },
            {
                name_py: "jianshi",
                weathercnid: "101240601",
                name_en: "Ji'an",
                name: "吉安市",
                city_id: 1346
            },
            {
                name_py: "jinggangshanshi",
                weathercnid: "101240608",
                name_en: "Jinggangshan",
                name: "井冈山市",
                city_id: 1357
            },
            {
                name_py: "yichunshi",
                weathercnid: "101240501",
                name_en: "Yichun, Jiangxi",
                name: "宜春市",
                city_id: 1360
            },
            {
                name_py: "fengchengshi",
                weathercnid: "101240510",
                name_en: "Fengcheng, Jiangxi",
                name: "丰城市",
                city_id: 1361
            },
            {
                name_py: "zhangshushi",
                weathercnid: "101240509",
                name_en: "Zhangshu",
                name: "樟树市",
                city_id: 1362
            },
            {
                name_py: "gaoanshi",
                weathercnid: "101240508",
                name_en: "Gaoan",
                name: "高安市",
                city_id: 1363
            },
            {
                name_py: "fuzhoushi",
                weathercnid: "101240401",
                name_en: "Fuzhou",
                name: "抚州市",
                city_id: 1382
            },
            {
                name_py: "shangraoshi",
                weathercnid: "101240301",
                name_en: "Shangrao",
                name: "上饶市",
                city_id: 1384
            },
            {
                name_py: "dexingshi",
                weathercnid: "101240307",
                name_en: "Dexing",
                name: "德兴市",
                city_id: 1385
            },
            {
                name_py: "gongqingchengshi",
                weathercnid: "101240201",
                name_en: "Gongqingcheng",
                name: "共青城市",
                city_id: 284963
            }
        ],
        name: "江西省"
    },
    {
        list: [
            {
                name_py: "wuhanshi",
                weathercnid: "101200101",
                name_en: "Wuhan",
                name: "武汉市",
                city_id: 537
            },
            {
                name_py: "huangshishi",
                weathercnid: "101200601",
                name_en: "Huangshi",
                name: "黄石市",
                city_id: 546
            },
            {
                name_py: "dayeshi",
                weathercnid: "101200602",
                name_en: "Daye",
                name: "大冶市",
                city_id: 547
            },
            {
                name_py: "xiangyangshi",
                weathercnid: "101200201",
                name_en: "Xiangyang",
                name: "襄阳市",
                city_id: 553
            },
            {
                name_py: "zaoyangshi",
                weathercnid: "101200208",
                name_en: "Zaoyang",
                name: "枣阳市",
                city_id: 555
            },
            {
                name_py: "laohekoushi",
                weathercnid: "101200206",
                name_en: "Laohekou",
                name: "老河口市",
                city_id: 556
            },
            {
                name_py: "yichengshi",
                weathercnid: "101200205",
                name_en: "Yicheng",
                name: "宜城市",
                city_id: 557
            },
            {
                name_py: "Ezhoushi",
                weathercnid: "101200301",
                name_en: "Ezhou",
                name: "鄂州市",
                city_id: 562
            },
            {
                name_py: "shiyanshi",
                weathercnid: "101201101",
                name_en: "Shiyan",
                name: "十堰市",
                city_id: 565
            },
            {
                name_py: "danjiangkoushi",
                weathercnid: "101201107",
                name_en: "Danjiangkou",
                name: "丹江口市",
                city_id: 571
            },
            {
                name_py: "shishoushi",
                weathercnid: "101200804",
                name_en: "Shishou",
                name: "石首市",
                city_id: 576
            },
            {
                name_py: "honghushi",
                weathercnid: "101200806",
                name_en: "Honghu",
                name: "洪湖市",
                city_id: 577
            },
            {
                name_py: "songzishi",
                weathercnid: "101200807",
                name_en: "Songzi",
                name: "松滋市",
                city_id: 578
            },
            {
                name_py: "jingzhoushi",
                weathercnid: "101200801",
                name_en: "Jingzhou",
                name: "荆州市",
                city_id: 582
            },
            {
                name_py: "yichangshi",
                weathercnid: "101200901",
                name_en: "Yichang",
                name: "宜昌市",
                city_id: 584
            },
            {
                name_py: "yidushi",
                weathercnid: "101200909",
                name_en: "Yidu",
                name: "宜都市",
                city_id: 585
            },
            {
                name_py: "dangyangshi",
                weathercnid: "101200907",
                name_en: "Dangyang",
                name: "当阳市",
                city_id: 586
            },
            {
                name_py: "zhijiangshi",
                weathercnid: "101200910",
                name_en: "Zhijiang",
                name: "枝江市",
                city_id: 587
            },
            {
                name_py: "jingmenshi",
                weathercnid: "101201401",
                name_en: "Jingmen",
                name: "荆门市",
                city_id: 597
            },
            {
                name_py: "zhongxiangshi",
                weathercnid: "101201402",
                name_en: "Zhongxiang",
                name: "钟祥市",
                city_id: 599
            },
            {
                name_py: "xiaoganshi",
                weathercnid: "101200401",
                name_en: "Xiaogan",
                name: "孝感市",
                city_id: 603
            },
            {
                name_py: "hanchuanshi",
                weathercnid: "101200406",
                name_en: "Hanchuan",
                name: "汉川市",
                city_id: 604
            },
            {
                name_py: "anlushi",
                weathercnid: "101200402",
                name_en: "Anlu",
                name: "安陆市",
                city_id: 605
            },
            {
                name_py: "yingchengshi",
                weathercnid: "101200405",
                name_en: "Yingcheng",
                name: "应城市",
                city_id: 606
            },
            {
                name_py: "huanggangshi",
                weathercnid: "101200501",
                name_en: "Huanggang",
                name: "黄冈市",
                city_id: 611
            },
            {
                name_py: "machengshi",
                weathercnid: "101200503",
                name_en: "Macheng",
                name: "麻城市",
                city_id: 612
            },
            {
                name_py: "wuxueshi",
                weathercnid: "101200509",
                name_en: "Wuxue",
                name: "武穴市",
                city_id: 613
            },
            {
                name_py: "xianningshi",
                weathercnid: "101200701",
                name_en: "Xianning",
                name: "咸宁市",
                city_id: 622
            },
            {
                name_py: "suizhoushi",
                weathercnid: "101201301",
                name_en: "Suizhou",
                name: "随州市",
                city_id: 629
            },
            {
                name_py: "guangshuishi",
                weathercnid: "101201302",
                name_en: "Guangshui",
                name: "广水市",
                city_id: 630
            },
            {
                name_py: "lichuanshi",
                weathercnid: "101201002",
                name_en: "Lichuan",
                name: "利川市",
                city_id: 633
            },
            {
                name_py: "xiantaoshi",
                weathercnid: "101201601",
                name_en: "Xiantao",
                name: "仙桃市",
                city_id: 641
            },
            {
                name_py: "qianjiangshi",
                weathercnid: "101201701",
                name_en: "Qianjiang",
                name: "潜江市",
                city_id: 643
            },
            {
                name_py: "tianmenshi",
                weathercnid: "101201501",
                name_en: "Tianmen",
                name: "天门市",
                city_id: 645
            },
            {
                name_py: "enshishi",
                weathercnid: "101201001",
                name_en: "Enshi",
                name: "恩施市",
                city_id: 285083
            }
        ],
        name: "湖北省"
    },
    {
        list: [
            {
                name_py: "changshashi",
                weathercnid: "101250101",
                name_en: "Changsha",
                name: "长沙市",
                city_id: 650
            },
            {
                name_py: "liuyangshi",
                weathercnid: "101250103",
                name_en: "Liuyang",
                name: "浏阳市",
                city_id: 651
            },
            {
                name_py: "zhuzhoushi",
                weathercnid: "101250301",
                name_en: "Zhuzhou",
                name: "株洲市",
                city_id: 657
            },
            {
                name_py: "lilingshi",
                weathercnid: "101250303",
                name_en: "Liling",
                name: "醴陵市",
                city_id: 658
            },
            {
                name_py: "xiangtanshi",
                weathercnid: "101250201",
                name_en: "Xiangtan",
                name: "湘潭市",
                city_id: 664
            },
            {
                name_py: "xiangxiangshi",
                weathercnid: "101250203",
                name_en: "Xiangxiang",
                name: "湘乡市",
                city_id: 665
            },
            {
                name_py: "shaoshanshi",
                weathercnid: "101250202",
                name_en: "Shaoshan City",
                name: "韶山市",
                city_id: 667
            },
            {
                name_py: "hengyangshi",
                weathercnid: "101250401",
                name_en: "Hengyang",
                name: "衡阳市",
                city_id: 669
            },
            {
                name_py: "leiyangshi",
                weathercnid: "101250408",
                name_en: "Leiyang",
                name: "耒阳市",
                city_id: 671
            },
            {
                name_py: "changningshi",
                weathercnid: "101250406",
                name_en: "Changning",
                name: "常宁市",
                city_id: 672
            },
            {
                name_py: "shaoyangshi",
                weathercnid: "101250901",
                name_en: "Shaoyang",
                name: "邵阳市",
                city_id: 679
            },
            {
                name_py: "wugangshi",
                weathercnid: "101250908",
                name_en: "Wugang, Shaoyang",
                name: "武冈市",
                city_id: 680
            },
            {
                name_py: "yueyangshi",
                weathercnid: "101251001",
                name_en: "Yueyang",
                name: "岳阳市",
                city_id: 690
            },
            {
                name_py: "miluoshi",
                weathercnid: "101251004",
                name_en: "Miluo",
                name: "汨罗市",
                city_id: 691
            },
            {
                name_py: "linxiangshi",
                weathercnid: "101251006",
                name_en: "Linxiang",
                name: "临湘市",
                city_id: 692
            },
            {
                name_py: "changdeshi",
                weathercnid: "101250601",
                name_en: "Changde",
                name: "常德市",
                city_id: 699
            },
            {
                name_py: "jinshishi",
                weathercnid: "101250608",
                name_en: "Jinshi",
                name: "津市市",
                city_id: 700
            },
            {
                name_py: "zhangjiajieshi",
                weathercnid: "101251101",
                name_en: "Zhangjiajie",
                name: "张家界市",
                city_id: 708
            },
            {
                name_py: "yiyangshi",
                weathercnid: "101250700",
                name_en: "Yiyang",
                name: "益阳市",
                city_id: 713
            },
            {
                name_py: "yuanjiangshi",
                weathercnid: "101250705",
                name_en: "Yuanjiang",
                name: "沅江市",
                city_id: 714
            },
            {
                name_py: "chenzhoushi",
                weathercnid: "101250501",
                name_en: "Chenzhou",
                name: "郴州市",
                city_id: 720
            },
            {
                name_py: "zixingshi",
                weathercnid: "101250507",
                name_en: "Zixing",
                name: "资兴市",
                city_id: 721
            },
            {
                name_py: "yongzhoushi",
                weathercnid: "101251401",
                name_en: "Yongzhou",
                name: "永州市",
                city_id: 732
            },
            {
                name_py: "huaihuashi",
                weathercnid: "101251201",
                name_en: "Huaihua",
                name: "怀化市",
                city_id: 744
            },
            {
                name_py: "loudishi",
                weathercnid: "101250801",
                name_en: "Loudi",
                name: "娄底市",
                city_id: 756
            },
            {
                name_py: "lengshuijiangshi",
                weathercnid: "101250803",
                name_en: "Lengshuijiang",
                name: "冷水江市",
                city_id: 757
            },
            {
                name_py: "lianyuanshi",
                weathercnid: "101250806",
                name_en: "Lianyuan",
                name: "涟源市",
                city_id: 758
            },
            {
                name_py: "jishoushi",
                weathercnid: "101251501",
                name_en: "Jishou",
                name: "吉首市",
                city_id: 763
            },
            {
                name_py: "hongjiangshi",
                weathercnid: "101251213",
                name_en: "Hongjiang",
                name: "洪江市",
                city_id: 773
            }
        ],
        name: "湖南省"
    },
    {
        list: [
            {
                name_py: "taiyuanshi",
                weathercnid: "101100101",
                name_en: "Taiyuan",
                name: "太原市",
                city_id: 1909
            },
            {
                name_py: "gujiaoshi",
                weathercnid: "101100105",
                name_en: "Gujiao",
                name: "古交市",
                city_id: 1911
            },
            {
                name_py: "datongshi",
                weathercnid: "101100201",
                name_en: "Datong",
                name: "大同市",
                city_id: 1918
            },
            {
                name_py: "yangquanshi",
                weathercnid: "101100301",
                name_en: "Yangquan",
                name: "阳泉市",
                city_id: 1927
            },
            {
                name_py: "changzhishi",
                weathercnid: "101100501",
                name_en: "Changzhi",
                name: "长治市",
                city_id: 1933
            },
            {
                name_py: "luchengshi",
                weathercnid: "101100504",
                name_en: "Lucheng",
                name: "潞城市",
                city_id: 1943
            },
            {
                name_py: "jinchengshi",
                weathercnid: "101100601",
                name_en: "Jincheng",
                name: "晋城市",
                city_id: 1945
            },
            {
                name_py: "gaopingshi",
                weathercnid: "101100605",
                name_en: "Gaoping",
                name: "高平市",
                city_id: 1946
            },
            {
                name_py: "shuozhoushi",
                weathercnid: "101100901",
                name_en: "Shuozhou",
                name: "朔州市",
                city_id: 1952
            },
            {
                name_py: "jinzhongshi",
                weathercnid: "101100401",
                name_en: "Jinzhong",
                name: "晋中市",
                city_id: 1959
            },
            {
                name_py: "jiexiushi",
                weathercnid: "101100412",
                name_en: "Jiexiu",
                name: "介休市",
                city_id: 1961
            },
            {
                name_py: "yunchengshi",
                weathercnid: "101100801",
                name_en: "Yuncheng",
                name: "运城市",
                city_id: 1972
            },
            {
                name_py: "yongjishi",
                weathercnid: "101100810",
                name_en: "Yongji",
                name: "永济市",
                city_id: 1973
            },
            {
                name_py: "hejinshi",
                weathercnid: "101100805",
                name_en: "Hejin",
                name: "河津市",
                city_id: 1974
            },
            {
                name_py: "xinzhoushi",
                weathercnid: "101101001",
                name_en: "Xinzhou",
                name: "忻州市",
                city_id: 1986
            },
            {
                name_py: "yuanpingshi",
                weathercnid: "101101015",
                name_en: "Yuanping",
                name: "原平市",
                city_id: 1987
            },
            {
                name_py: "linfenshi",
                weathercnid: "101100701",
                name_en: "Linfen",
                name: "临汾市",
                city_id: 2002
            },
            {
                name_py: "houmashi",
                weathercnid: "101100714",
                name_en: "Houma",
                name: "侯马市",
                city_id: 2003
            },
            {
                name_py: "huozhoushi",
                weathercnid: "101100711",
                name_en: "Huozhou",
                name: "霍州市",
                city_id: 2004
            },
            {
                name_py: "luliangshi",
                weathercnid: "101101100",
                name_en: "Luliang",
                name: "吕梁市",
                city_id: 2020
            },
            {
                name_py: "xiaoyishi",
                weathercnid: "101101110",
                name_en: "Xiaoyi",
                name: "孝义市",
                city_id: 2022
            },
            {
                name_py: "fenyangshi",
                weathercnid: "101101111",
                name_en: "Fenyang",
                name: "汾阳市",
                city_id: 2023
            }
        ],
        name: "山西省"
    },
    {
        list: [
            {
                name_py: "nanjingshi",
                weathercnid: "101190101",
                name_en: "Nanjing",
                name: "南京市",
                city_id: 1045
            },
            {
                name_py: "wuxishi",
                weathercnid: "101190201",
                name_en: "Wuxi",
                name: "无锡市",
                city_id: 1061
            },
            {
                name_py: "jiangyinshi",
                weathercnid: "101190202",
                name_en: "Jiangyin",
                name: "江阴市",
                city_id: 1068
            },
            {
                name_py: "yixingshi",
                weathercnid: "101190203",
                name_en: "Yixing",
                name: "宜兴市",
                city_id: 1069
            },
            {
                name_py: "xuzhoushi",
                weathercnid: "101190801",
                name_en: "Xuzhou",
                name: "徐州市",
                city_id: 1071
            },
            {
                name_py: "xinyishi",
                weathercnid: "101190807",
                name_en: "Xinyi, Xuzhou",
                name: "新沂市",
                city_id: 1077
            },
            {
                name_py: "pizhoushi",
                weathercnid: "101190805",
                name_en: "Pizhou",
                name: "邳州市",
                city_id: 1078
            },
            {
                name_py: "changzhoushi",
                weathercnid: "101191101",
                name_en: "Changzhou",
                name: "常州市",
                city_id: 1084
            },
            {
                name_py: "liyangshi",
                weathercnid: "101191102",
                name_en: "Liyang",
                name: "溧阳市",
                city_id: 1091
            },
            {
                name_py: "suzhoushi",
                weathercnid: "101190401",
                name_en: "Suzhou, Jiangsu",
                name: "苏州市",
                city_id: 1093
            },
            {
                name_py: "changshushi",
                weathercnid: "101190402",
                name_en: "Changshu",
                name: "常熟市",
                city_id: 1100
            },
            {
                name_py: "zhangjiagangshi",
                weathercnid: "101190403",
                name_en: "Zhangjiagang",
                name: "张家港市",
                city_id: 1101
            },
            {
                name_py: "kunshanshi",
                weathercnid: "101190404",
                name_en: "Kunshan",
                name: "昆山市",
                city_id: 1102
            },
            {
                name_py: "taicangshi",
                weathercnid: "101190408",
                name_en: "Taicang",
                name: "太仓市",
                city_id: 1104
            },
            {
                name_py: "nantongshi",
                weathercnid: "101190501",
                name_en: "Nantong",
                name: "南通市",
                city_id: 1108
            },
            {
                name_py: "qidongshi",
                weathercnid: "101190507",
                name_en: "Qidong",
                name: "启东市",
                city_id: 1111
            },
            {
                name_py: "rugaoshi",
                weathercnid: "101190503",
                name_en: "Rugao",
                name: "如皋市",
                city_id: 1112
            },
            {
                name_py: "haimenshi",
                weathercnid: "101190508",
                name_en: "Haimen",
                name: "海门市",
                city_id: 1114
            },
            {
                name_py: "lianyungangshi",
                weathercnid: "101191001",
                name_en: "Lianyungang",
                name: "连云港市",
                city_id: 1119
            },
            {
                name_py: "huaianshi",
                weathercnid: "101190901",
                name_en: "Huaian",
                name: "淮安市",
                city_id: 1130
            },
            {
                name_py: "yanchengshi",
                weathercnid: "101190701",
                name_en: "Yancheng",
                name: "盐城市",
                city_id: 1141
            },
            {
                name_py: "dongtaishi",
                weathercnid: "101190707",
                name_en: "Dongtai",
                name: "东台市",
                city_id: 1144
            },
            {
                name_py: "dafengshi",
                weathercnid: "101190708",
                name_en: "Dafeng",
                name: "大丰市",
                city_id: 1145
            },
            {
                name_py: "yangzhoushi",
                weathercnid: "101190601",
                name_en: "Yangzhou",
                name: "扬州市",
                city_id: 1152
            },
            {
                name_py: "yizhengshi",
                weathercnid: "101190603",
                name_en: "Yizheng",
                name: "仪征市",
                city_id: 1156
            },
            {
                name_py: "gaoyoushi",
                weathercnid: "101190604",
                name_en: "Gaoyou",
                name: "高邮市",
                city_id: 1157
            },
            {
                name_py: "zhenjiangshi",
                weathercnid: "101190301",
                name_en: "Zhenjiang",
                name: "镇江市",
                city_id: 1161
            },
            {
                name_py: "danyangshi",
                weathercnid: "101190302",
                name_en: "Danyang",
                name: "丹阳市",
                city_id: 1165
            },
            {
                name_py: "yangzhongshi",
                weathercnid: "101190303",
                name_en: "Yangzhong",
                name: "扬中市",
                city_id: 1166
            },
            {
                name_py: "jurongshi",
                weathercnid: "101190304",
                name_en: "Jurong",
                name: "句容市",
                city_id: 1167
            },
            {
                name_py: "taizhoushi",
                weathercnid: "101191201",
                name_en: "Taizhou, Jiangsu",
                name: "泰州市",
                city_id: 1169
            },
            {
                name_py: "xinghuashi",
                weathercnid: "101191202",
                name_en: "Xinghua",
                name: "兴化市",
                city_id: 1172
            },
            {
                name_py: "jingjiangshi",
                weathercnid: "101191205",
                name_en: "Jingjiang",
                name: "靖江市",
                city_id: 1173
            },
            {
                name_py: "taixingshi",
                weathercnid: "101191203",
                name_en: "Taixing",
                name: "泰兴市",
                city_id: 1174
            },
            {
                name_py: "suqianshi",
                weathercnid: "101191301",
                name_en: "Suqian",
                name: "宿迁市",
                city_id: 1177
            }
        ],
        name: "江苏省"
    },
    {
        list: [
            {
                name_py: "hangzhoushi",
                weathercnid: "101210101",
                name_en: "Hangzhou",
                name: "杭州市",
                city_id: 1185
            },
            {
                name_py: "jiandeshi",
                weathercnid: "101210105",
                name_en: "Jiande",
                name: "建德市",
                city_id: 1188
            },
            {
                name_py: "linanshi",
                weathercnid: "101210107",
                name_en: "Lin'an",
                name: "临安市",
                city_id: 1190
            },
            {
                name_py: "taizhoushi",
                weathercnid: "101210601",
                name_en: "Taizhou, Zhejiang",
                name: "台州市",
                city_id: 1194
            },
            {
                name_py: "linhaishi",
                weathercnid: "101210610",
                name_en: "Linhai",
                name: "临海市",
                city_id: 1198
            },
            {
                name_py: "wenlingshi",
                weathercnid: "101210607",
                name_en: "Wenling",
                name: "温岭市",
                city_id: 1199
            },
            {
                name_py: "ningboshi",
                weathercnid: "101210401",
                name_en: "Ningbo",
                name: "宁波市",
                city_id: 1208
            },
            {
                name_py: "yuyaoshi",
                weathercnid: "101210404",
                name_en: "Yuyao",
                name: "余姚市",
                city_id: 1211
            },
            {
                name_py: "cixishi",
                weathercnid: "101210403",
                name_en: "Cixi",
                name: "慈溪市",
                city_id: 1212
            },
            {
                name_py: "fenghuashi",
                weathercnid: "101210405",
                name_en: "Fenghua",
                name: "奉化市",
                city_id: 1213
            },
            {
                name_py: "wenzhoushi",
                weathercnid: "101210701",
                name_en: "Wenzhou",
                name: "温州市",
                city_id: 1220
            },
            {
                name_py: "ruianshi",
                weathercnid: "101210705",
                name_en: "Rui'an",
                name: "瑞安市",
                city_id: 1222
            },
            {
                name_py: "yueqingshi",
                weathercnid: "101210707",
                name_en: "Yueqing",
                name: "乐清市",
                city_id: 1223
            },
            {
                name_py: "jiaxingshi",
                weathercnid: "101210301",
                name_en: "Jiaxing",
                name: "嘉兴市",
                city_id: 1233
            },
            {
                name_py: "hainingshi",
                weathercnid: "101210303",
                name_en: "Haining",
                name: "海宁市",
                city_id: 1235
            },
            {
                name_py: "pinghushi",
                weathercnid: "101210305",
                name_en: "Pinghu",
                name: "平湖市",
                city_id: 1236
            },
            {
                name_py: "tongxiangshi",
                weathercnid: "101210304",
                name_en: "Tongxiang",
                name: "桐乡市",
                city_id: 1237
            },
            {
                name_py: "huzhoushi",
                weathercnid: "101210201",
                name_en: "Huzhou",
                name: "湖州市",
                city_id: 1241
            },
            {
                name_py: "shaoxingshi",
                weathercnid: "101210501",
                name_en: "Shaoxing",
                name: "绍兴市",
                city_id: 1246
            },
            {
                name_py: "zhujishi",
                weathercnid: "101210502",
                name_en: "Zhuji",
                name: "诸暨市",
                city_id: 1248
            },
            {
                name_py: "shengzhoushi",
                weathercnid: "101210505",
                name_en: "Shengzhou",
                name: "嵊州市",
                city_id: 1250
            },
            {
                name_py: "jinhuashi",
                weathercnid: "101210901",
                name_en: "Jinhua",
                name: "金华市",
                city_id: 1253
            },
            {
                name_py: "lanxishi",
                weathercnid: "101210903",
                name_en: "Lanxi",
                name: "兰溪市",
                city_id: 1254
            },
            {
                name_py: "yiwushi",
                weathercnid: "101210904",
                name_en: "Yiwu",
                name: "义乌市",
                city_id: 1255
            },
            {
                name_py: "dongyangshi",
                weathercnid: "101210905",
                name_en: "Dongyang",
                name: "东阳市",
                city_id: 1256
            },
            {
                name_py: "yongkangshi",
                weathercnid: "101210907",
                name_en: "Yongkang",
                name: "永康市",
                city_id: 1257
            },
            {
                name_py: "quzhoushi",
                weathercnid: "101211001",
                name_en: "Quzhou",
                name: "衢州市",
                city_id: 1262
            },
            {
                name_py: "jiangshanshi",
                weathercnid: "101211005",
                name_en: "Jiangshan City",
                name: "江山市",
                city_id: 1263
            },
            {
                name_py: "zhoushanshi",
                weathercnid: "101211101",
                name_en: "Zhoushan",
                name: "舟山市",
                city_id: 1269
            },
            {
                name_py: "lishuishi",
                weathercnid: "101210801",
                name_en: "Lishui",
                name: "丽水市",
                city_id: 1275
            },
            {
                name_py: "longquanshi",
                weathercnid: "101210803",
                name_en: "Longquan",
                name: "龙泉市",
                city_id: 1276
            }
        ],
        name: "浙江省"
    },
    {
        list: [
            {
                name_py: "xiningshi",
                weathercnid: "101150101",
                name_en: "Xining",
                name: "西宁市",
                city_id: 2440
            },
            {
                name_py: "haidongshi",
                weathercnid: "101150201",
                name_en: "Haidong",
                name: "海东市",
                city_id: 2451
            },
            {
                name_py: "geermushi",
                weathercnid: "101150714",
                name_en: "Golmud",
                name: "格尔木市",
                city_id: 2490
            },
            {
                name_py: "delinghashi",
                weathercnid: "101150716",
                name_en: "Delhi",
                name: "德令哈市",
                city_id: 2491
            },
            {
                name_py: "yushushi",
                weathercnid: "101150601",
                name_en: "Yushu, Qinghai",
                name: "玉树市",
                city_id: 285302
            }
        ],
        name: "青海省"
    },
    {
        list: [
            {
                name_py: "yinchuanshi",
                weathercnid: "101170101",
                name_en: "Yinchuan",
                name: "银川市",
                city_id: 2299
            },
            {
                name_py: "lingwushi",
                weathercnid: "101170103",
                name_en: "Lingwu",
                name: "灵武市",
                city_id: 2300
            },
            {
                name_py: "shizuishanshi",
                weathercnid: "101170201",
                name_en: "Shizuishan",
                name: "石嘴山市",
                city_id: 2304
            },
            {
                name_py: "wuzhongshi",
                weathercnid: "101170301",
                name_en: "Wuzhong",
                name: "吴忠市",
                city_id: 2311
            },
            {
                name_py: "qingtongxiashi",
                weathercnid: "101170306",
                name_en: "Qingtongxia",
                name: "青铜峡市",
                city_id: 2312
            },
            {
                name_py: "guyuanshi",
                weathercnid: "101170401",
                name_en: "Guyuan",
                name: "固原市",
                city_id: 2318
            },
            {
                name_py: "zhongweishi",
                weathercnid: "101170501",
                name_en: "Zhongwei",
                name: "中卫市",
                city_id: 2325
            }
        ],
        name: "宁夏回族自治区"
    },
    {
        list: [
            {
                name_py: "guangzhoushi",
                weathercnid: "101280101",
                name_en: "Guangzhou",
                name: "广州市",
                city_id: 886
            },
            {
                name_py: "shenzhenshi",
                weathercnid: "101280601",
                name_en: "Shenzhen",
                name: "深圳市",
                city_id: 892
            },
            {
                name_py: "zhuhaishi",
                weathercnid: "101280701",
                name_en: "Zhuhai",
                name: "珠海市",
                city_id: 895
            },
            {
                name_py: "shantoushi",
                weathercnid: "101280501",
                name_en: "Shantou",
                name: "汕头市",
                city_id: 900
            },
            {
                name_py: "shaoguanshi",
                weathercnid: "101280201",
                name_en: "Shaoguan",
                name: "韶关市",
                city_id: 905
            },
            {
                name_py: "lechangshi",
                weathercnid: "101280205",
                name_en: "Lechang",
                name: "乐昌市",
                city_id: 907
            },
            {
                name_py: "nanxiongshi",
                weathercnid: "101280207",
                name_en: "Nanxiong",
                name: "南雄市",
                city_id: 908
            },
            {
                name_py: "foshanshi",
                weathercnid: "101280800",
                name_en: "Foshan",
                name: "佛山市",
                city_id: 917
            },
            {
                name_py: "jiangmenshi",
                weathercnid: "101281101",
                name_en: "Jiangmen",
                name: "江门市",
                city_id: 923
            },
            {
                name_py: "taishanshi",
                weathercnid: "101281106",
                name_en: "Taishan",
                name: "台山市",
                city_id: 925
            },
            {
                name_py: "kaipingshi",
                weathercnid: "101281103",
                name_en: "Kaiping",
                name: "开平市",
                city_id: 926
            },
            {
                name_py: "heshanshi",
                weathercnid: "101281108",
                name_en: "Heshan, Jiangmen",
                name: "鹤山市",
                city_id: 927
            },
            {
                name_py: "enpingshi",
                weathercnid: "101281105",
                name_en: "Enping",
                name: "恩平市",
                city_id: 928
            },
            {
                name_py: "maomingshi",
                weathercnid: "101282001",
                name_en: "Maoming",
                name: "茂名市",
                city_id: 933
            },
            {
                name_py: "gaozhoushi",
                weathercnid: "101282002",
                name_en: "Gaozhou",
                name: "高州市",
                city_id: 934
            },
            {
                name_py: "huazhoushi",
                weathercnid: "101282003",
                name_en: "Huazhou",
                name: "化州市",
                city_id: 935
            },
            {
                name_py: "xinyishi",
                weathercnid: "101282005",
                name_en: "Xinyi, Maoming",
                name: "信宜市",
                city_id: 936
            },
            {
                name_py: "zhanjiangshi",
                weathercnid: "101281001",
                name_en: "Zhanjiang",
                name: "湛江市",
                city_id: 940
            },
            {
                name_py: "lianjiangshi",
                weathercnid: "101281005",
                name_en: "Lianjiang",
                name: "廉江市",
                city_id: 941
            },
            {
                name_py: "leizhoushi",
                weathercnid: "101281003",
                name_en: "Leizhou",
                name: "雷州市",
                city_id: 942
            },
            {
                name_py: "wuchuanshi",
                weathercnid: "101281002",
                name_en: "Wuchuan",
                name: "吴川市",
                city_id: 943
            },
            {
                name_py: "zhaoqingshi",
                weathercnid: "101280901",
                name_en: "Zhaoqing",
                name: "肇庆市",
                city_id: 951
            },
            {
                name_py: "sihuishi",
                weathercnid: "101280903",
                name_en: "Sihui",
                name: "四会市",
                city_id: 953
            },
            {
                name_py: "huizhoushi",
                weathercnid: "101280301",
                name_en: "Huizhou",
                name: "惠州市",
                city_id: 959
            },
            {
                name_py: "meizhoushi",
                weathercnid: "101280401",
                name_en: "Meizhou",
                name: "梅州市",
                city_id: 965
            },
            {
                name_py: "xingningshi",
                weathercnid: "101280402",
                name_en: "Xingning",
                name: "兴宁市",
                city_id: 966
            },
            {
                name_py: "shanweishi",
                weathercnid: "101282101",
                name_en: "Shanwei",
                name: "汕尾市",
                city_id: 974
            },
            {
                name_py: "lufengshi",
                weathercnid: "101282103",
                name_en: "Lufeng",
                name: "陆丰市",
                city_id: 975
            },
            {
                name_py: "heyuanshi",
                weathercnid: "101281201",
                name_en: "Heyuan",
                name: "河源市",
                city_id: 979
            },
            {
                name_py: "yangjiangshi",
                weathercnid: "101281801",
                name_en: "Yangjiang",
                name: "阳江市",
                city_id: 986
            },
            {
                name_py: "yangchunshi",
                weathercnid: "101281802",
                name_en: "Yangchun",
                name: "阳春市",
                city_id: 987
            },
            {
                name_py: "qingyuanshi",
                weathercnid: "101281301",
                name_en: "Qingyuan",
                name: "清远市",
                city_id: 991
            },
            {
                name_py: "yingdeshi",
                weathercnid: "101281307",
                name_en: "Yingde",
                name: "英德市",
                city_id: 992
            },
            {
                name_py: "lianzhoushi",
                weathercnid: "101281303",
                name_en: "Lianzhou",
                name: "连州市",
                city_id: 993
            },
            {
                name_py: "dongguanshi",
                weathercnid: "101281601",
                name_en: "Dongguan",
                name: "东莞市",
                city_id: 1000
            },
            {
                name_py: "zhongshanshi",
                weathercnid: "101281701",
                name_en: "Zhongshan",
                name: "中山市",
                city_id: 1002
            },
            {
                name_py: "chaozhoushi",
                weathercnid: "101281501",
                name_en: "Chaozhou",
                name: "潮州市",
                city_id: 1004
            },
            {
                name_py: "jieyangshi",
                weathercnid: "101281901",
                name_en: "Jieyang",
                name: "揭阳市",
                city_id: 1008
            },
            {
                name_py: "puningshi",
                weathercnid: "101281903",
                name_en: "Puning",
                name: "普宁市",
                city_id: 1009
            },
            {
                name_py: "yunfushi",
                weathercnid: "101281401",
                name_en: "Yunfu",
                name: "云浮市",
                city_id: 1014
            },
            {
                name_py: "luodingshi",
                weathercnid: "101281402",
                name_en: "Luoding",
                name: "罗定市",
                city_id: 1015
            }
        ],
        name: "广东省"
    },
    {
        list: [
            {
                name_py: "haikoushi",
                weathercnid: "101310101",
                name_en: "Haikou",
                name: "海口市",
                city_id: 1020
            },
            {
                name_py: "sanyashi",
                weathercnid: "101310201",
                name_en: "Sanya",
                name: "三亚市",
                city_id: 1022
            },
            {
                name_py: "wenchangshi",
                weathercnid: "101310212",
                name_en: "Wenchang",
                name: "文昌市",
                city_id: 1023
            },
            {
                name_py: "qionghaishi",
                weathercnid: "101310211",
                name_en: "Qionghai",
                name: "琼海市",
                city_id: 1024
            },
            {
                name_py: "wanningshi",
                weathercnid: "101310215",
                name_en: "Wanning",
                name: "万宁市",
                city_id: 1025
            },
            {
                name_py: "dongfangshi",
                weathercnid: "101310202",
                name_en: "Dongfang",
                name: "东方市",
                city_id: 1026
            },
            {
                name_py: "wuzhishanshi",
                weathercnid: "101310222",
                name_en: "Wuzhishan",
                name: "五指山市",
                city_id: 1027
            },
            {
                name_py: "danzhoushi",
                weathercnid: "101310205",
                name_en: "Danzhou",
                name: "儋州市",
                city_id: 1028
            },
            {
                name_py: "sanshashi",
                weathercnid: "101310217",
                name_en: "Sansha",
                name: "三沙市",
                city_id: 1041
            }
        ],
        name: "海南省"
    },
    {
        list: [
            {
                name_py: "kunmingshi",
                weathercnid: "101290101",
                name_en: "Kunming",
                name: "昆明市",
                city_id: 2827
            },
            {
                name_py: "qujingshi",
                weathercnid: "101290401",
                name_en: "Qujing",
                name: "曲靖市",
                city_id: 2841
            },
            {
                name_py: "xuanweishi",
                weathercnid: "101290409",
                name_en: "Xuanwei",
                name: "宣威市",
                city_id: 2842
            },
            {
                name_py: "yuxishi",
                weathercnid: "101290701",
                name_en: "Yuxi",
                name: "玉溪市",
                city_id: 2851
            },
            {
                name_py: "baoshanshi",
                weathercnid: "101290501",
                name_en: "Baoshan",
                name: "保山市",
                city_id: 2861
            },
            {
                name_py: "tengchongshi",
                weathercnid: "101290506",
                name_en: "Tengchong",
                name: "腾冲市",
                city_id: 2862
            },
            {
                name_py: "zhaotongshi",
                weathercnid: "101291001",
                name_en: "Zhaotong",
                name: "昭通市",
                city_id: 2868
            },
            {
                name_py: "lijiangshi",
                weathercnid: "101291401",
                name_en: "Lijiang",
                name: "丽江市",
                city_id: 2884
            },
            {
                name_py: "puershi",
                weathercnid: "101290901",
                name_en: "Puer",
                name: "普洱市",
                city_id: 2887
            },
            {
                name_py: "lincangshi",
                weathercnid: "101291101",
                name_en: "Lincang",
                name: "临沧市",
                city_id: 2899
            },
            {
                name_py: "mengzishi",
                weathercnid: "101290309",
                name_en: "Mengzi",
                name: "蒙自市",
                city_id: 2918
            },
            {
                name_py: "gejiushi",
                weathercnid: "101290308",
                name_en: "Gejiu",
                name: "个旧市",
                city_id: 2919
            },
            {
                name_py: "kaiyuanshi",
                weathercnid: "101290307",
                name_en: "Kaiyuan, Honghe",
                name: "开远市",
                city_id: 2920
            },
            {
                name_py: "mileshi",
                weathercnid: "101290304",
                name_en: "Mile",
                name: "弥勒市",
                city_id: 2924
            },
            {
                name_py: "ruilishi",
                weathercnid: "101291506",
                name_en: "Ruili",
                name: "瑞丽市",
                city_id: 2957
            },
            {
                name_py: "xianggelilashi",
                weathercnid: "101291301",
                name_en: "Shangri-La",
                name: "香格里拉市",
                city_id: 2971
            },
            {
                name_py: "jinghongshi",
                weathercnid: "101291601",
                name_en: "Jinghong",
                name: "景洪市",
                city_id: 2976
            },
            {
                name_py: "chuxiongshi",
                weathercnid: "101290801",
                name_en: "Chuxiong",
                name: "楚雄市",
                city_id: 285251
            },
            {
                name_py: "wenshanshi",
                weathercnid: "101290601",
                name_en: "Wensha",
                name: "文山市",
                city_id: 285253
            },
            {
                name_py: "dalishi",
                weathercnid: "101290201",
                name_en: "Dali",
                name: "大理市",
                city_id: 285255
            },
            {
                name_py: "mangshi",
                weathercnid: "101291501",
                name_en: "Mang City",
                name: "芒市",
                city_id: 285256
            }
        ],
        name: "云南省"
    },
    {
        list: [
            {
                name_py: "chongqingshi",
                weathercnid: "101040100",
                name_en: "Chongqing",
                name: "重庆市",
                city_id: 52
            }
        ],
        name: "重庆市"
    },
    {
        list: [
            {
                name_py: "shanghaishi",
                weathercnid: "101020100",
                name_en: "Shanghai",
                name: "上海市",
                city_id: 39
            }
        ],
        name: "上海市"
    },
    {
        list: [
            {
                name_py: "tianjinshi",
                weathercnid: "101030100",
                name_en: "Tianjin",
                name: "天津市",
                city_id: 24
            }
        ],
        name: "天津市"
    },
    {
        list: [
            {
                name_py: "xianshi",
                weathercnid: "101110101",
                name_en: "Xian",
                name: "西安市",
                city_id: 2182
            },
            {
                name_py: "tongchuanshi",
                weathercnid: "101111001",
                name_en: "Tongchuan",
                name: "铜川市",
                city_id: 2191
            },
            {
                name_py: "baojishi",
                weathercnid: "101110901",
                name_en: "Baoji",
                name: "宝鸡市",
                city_id: 2195
            },
            {
                name_py: "xianyangshi",
                weathercnid: "101110200",
                name_en: "Xianyang",
                name: "咸阳市",
                city_id: 2209
            },
            {
                name_py: "xingpingshi",
                weathercnid: "101110211",
                name_en: "Xingping",
                name: "兴平市",
                city_id: 2210
            },
            {
                name_py: "weinanshi",
                weathercnid: "101110501",
                name_en: "Weinan",
                name: "渭南市",
                city_id: 2223
            },
            {
                name_py: "huayinshi",
                weathercnid: "101110511",
                name_en: "Huayin",
                name: "华阴市",
                city_id: 2224
            },
            {
                name_py: "hanchengshi",
                weathercnid: "101110510",
                name_en: "Hancheng",
                name: "韩城市",
                city_id: 2225
            },
            {
                name_py: "yananshi",
                weathercnid: "101110300",
                name_en: "Yanan",
                name: "延安市",
                city_id: 2236
            },
            {
                name_py: "hanzhongshi",
                weathercnid: "101110801",
                name_en: "Hanzhong",
                name: "汉中市",
                city_id: 2250
            },
            {
                name_py: "yulinshi",
                weathercnid: "101110401",
                name_en: "Yulin, Shaanxi",
                name: "榆林市",
                city_id: 2262
            },
            {
                name_py: "ankangshi",
                weathercnid: "101110701",
                name_en: "Ankang",
                name: "安康市",
                city_id: 2276
            },
            {
                name_py: "shangluoshi",
                weathercnid: "101110601",
                name_en: "Shangluo",
                name: "商洛市",
                city_id: 2287
            }
        ],
        name: "陕西省"
    },
    {
        list: [
            {
                name_py: "lanzhoushi",
                weathercnid: "101160101",
                name_en: "Lanzhou",
                name: "兰州市",
                city_id: 2331
            },
            {
                name_py: "jinchangshi",
                weathercnid: "101160601",
                name_en: "Jinchang",
                name: "金昌市",
                city_id: 2336
            },
            {
                name_py: "baiyinshi",
                weathercnid: "101161301",
                name_en: "Baiyin",
                name: "白银市",
                city_id: 2339
            },
            {
                name_py: "tianshuishi",
                weathercnid: "101160901",
                name_en: "Tianshui",
                name: "天水市",
                city_id: 2345
            },
            {
                name_py: "jiayuguanshi",
                weathercnid: "101161401",
                name_en: "Jiayuguan",
                name: "嘉峪关市",
                city_id: 2354
            },
            {
                name_py: "wuweishi",
                weathercnid: "101160501",
                name_en: "Wuwei",
                name: "武威市",
                city_id: 2356
            },
            {
                name_py: "zhangyeshi",
                weathercnid: "101160701",
                name_en: "Zhangye",
                name: "张掖市",
                city_id: 2362
            },
            {
                name_py: "pingliangshi",
                weathercnid: "101160301",
                name_en: "Pingliang",
                name: "平凉市",
                city_id: 2369
            },
            {
                name_py: "jiuquanshi",
                weathercnid: "101160801",
                name_en: "Jiuquan",
                name: "酒泉市",
                city_id: 2378
            },
            {
                name_py: "yumenshi",
                weathercnid: "101160807",
                name_en: "Yumen",
                name: "玉门市",
                city_id: 2379
            },
            {
                name_py: "dunhuangshi",
                weathercnid: "101160808",
                name_en: "Dunhuang",
                name: "敦煌市",
                city_id: 2380
            },
            {
                name_py: "qingyangshi",
                weathercnid: "101160401",
                name_en: "Qingyang",
                name: "庆阳市",
                city_id: 2390
            },
            {
                name_py: "dingxishi",
                weathercnid: "101160201",
                name_en: "Dingxi",
                name: "定西市",
                city_id: 2400
            },
            {
                name_py: "hezuoshi",
                weathercnid: "101161201",
                name_en: "Hezuo (Zoi) City",
                name: "合作市",
                city_id: 2430
            },
            {
                name_py: "longnanshi",
                weathercnid: "101161001",
                name_en: "Longnan",
                name: "陇南市",
                city_id: 285294
            },
            {
                name_py: "linxiashi",
                weathercnid: "101161101",
                name_en: "Linxia",
                name: "临夏市",
                city_id: 285295
            }
        ],
        name: "甘肃省"
    },
    {
        list: [
            {
                name_py: "haerbinshi",
                weathercnid: "101050101",
                name_en: "Harbin",
                name: "哈尔滨市",
                city_id: 250
            },
            {
                name_py: "shangzhishi",
                weathercnid: "101050111",
                name_en: "Shangzhi",
                name: "尚志市",
                city_id: 254
            },
            {
                name_py: "wuchangshi",
                weathercnid: "101050112",
                name_en: "Wuchang",
                name: "五常市",
                city_id: 255
            },
            {
                name_py: "qiqihaershi",
                weathercnid: "101050201",
                name_en: "Qiqihar",
                name: "齐齐哈尔市",
                city_id: 267
            },
            {
                name_py: "neheshi",
                weathercnid: "101050202",
                name_en: "Nehe",
                name: "讷河市",
                city_id: 271
            },
            {
                name_py: "jixishi",
                weathercnid: "101051101",
                name_en: "Jixi",
                name: "鸡西市",
                city_id: 281
            },
            {
                name_py: "hulinshi",
                weathercnid: "101051102",
                name_en: "Hulin",
                name: "虎林市",
                city_id: 287
            },
            {
                name_py: "mishanshi",
                weathercnid: "101051103",
                name_en: "Mishan",
                name: "密山市",
                city_id: 288
            },
            {
                name_py: "hegangshi",
                weathercnid: "101051201",
                name_en: "Hegang",
                name: "鹤岗市",
                city_id: 291
            },
            {
                name_py: "shuangyashanshi",
                weathercnid: "101051301",
                name_en: "Shuangyashan",
                name: "双鸭山市",
                city_id: 295
            },
            {
                name_py: "daqingshi",
                weathercnid: "101050901",
                name_en: "Daqing",
                name: "大庆市",
                city_id: 305
            },
            {
                name_py: "yichunshi",
                weathercnid: "101050801",
                name_en: "Yichun, Heilongjiang",
                name: "伊春市",
                city_id: 316
            },
            {
                name_py: "tielishi",
                weathercnid: "101050804",
                name_en: "Tieli",
                name: "铁力市",
                city_id: 326
            },
            {
                name_py: "jiamusishi",
                weathercnid: "101050401",
                name_en: "Jiamusi",
                name: "佳木斯市",
                city_id: 331
            },
            {
                name_py: "tongjiangshi",
                weathercnid: "101050406",
                name_en: "River City with",
                name: "同江市",
                city_id: 332
            },
            {
                name_py: "fujinshi",
                weathercnid: "101050407",
                name_en: "Fujin",
                name: "富锦市",
                city_id: 333
            },
            {
                name_py: "qitaiheshi",
                weathercnid: "101051002",
                name_en: "Qitaihe",
                name: "七台河市",
                city_id: 339
            },
            {
                name_py: "mudanjiangshi",
                weathercnid: "101050301",
                name_en: "Mudanjiang",
                name: "牡丹江市",
                city_id: 342
            },
            {
                name_py: "mulingshi",
                weathercnid: "101050303",
                name_en: "Muling",
                name: "穆棱市",
                city_id: 343
            },
            {
                name_py: "suifenheshi",
                weathercnid: "101050305",
                name_en: "Suifenhe",
                name: "绥芬河市",
                city_id: 344
            },
            {
                name_py: "hailinshi",
                weathercnid: "101050302",
                name_en: "Hailin",
                name: "海林市",
                city_id: 345
            },
            {
                name_py: "ninganshi",
                weathercnid: "101050306",
                name_en: "Ning'an",
                name: "宁安市",
                city_id: 346
            },
            {
                name_py: "dongningshi",
                weathercnid: "101050307",
                name_en: "Dongning",
                name: "东宁市",
                city_id: 347
            },
            {
                name_py: "heiheshi",
                weathercnid: "101050601",
                name_en: "Heihe",
                name: "黑河市",
                city_id: 351
            },
            {
                name_py: "beianshi",
                weathercnid: "101050606",
                name_en: "Beian",
                name: "北安市",
                city_id: 353
            },
            {
                name_py: "wudalianchishi",
                weathercnid: "101050605",
                name_en: "Wudalianchi",
                name: "五大连池市",
                city_id: 354
            },
            {
                name_py: "suihuashi",
                weathercnid: "101050501",
                name_en: "Suihua",
                name: "绥化市",
                city_id: 359
            },
            {
                name_py: "andashi",
                weathercnid: "101050503",
                name_en: "Anda",
                name: "安达市",
                city_id: 360
            },
            {
                name_py: "zhaodongshi",
                weathercnid: "101050502",
                name_en: "Zhaodong",
                name: "肇东市",
                city_id: 361
            },
            {
                name_py: "hailunshi",
                weathercnid: "101050504",
                name_en: "Hailun",
                name: "海伦市",
                city_id: 362
            }
        ],
        name: "黑龙江省"
    },
    {
        list: [
            {
                name_py: "shenyangshi",
                weathercnid: "101070101",
                name_en: "Shenyang",
                name: "沈阳市",
                city_id: 94
            },
            {
                name_py: "xinminshi",
                weathercnid: "101070106",
                name_en: "Xinmin",
                name: "新民市",
                city_id: 97
            },
            {
                name_py: "dalianshi",
                weathercnid: "101070201",
                name_en: "Dalian",
                name: "大连市",
                city_id: 104
            },
            {
                name_py: "wafangdianshi",
                weathercnid: "101070202",
                name_en: "Wafangdian",
                name: "瓦房店市",
                city_id: 107
            },
            {
                name_py: "zhuangheshi",
                weathercnid: "101070207",
                name_en: "Zhuanghe",
                name: "庄河市",
                city_id: 109
            },
            {
                name_py: "anshanshi",
                weathercnid: "101070301",
                name_en: "Anshan",
                name: "鞍山市",
                city_id: 113
            },
            {
                name_py: "haichengshi",
                weathercnid: "101070304",
                name_en: "Haicheng",
                name: "海城市",
                city_id: 114
            },
            {
                name_py: "fushunshi",
                weathercnid: "101070401",
                name_en: "Fushun",
                name: "抚顺市",
                city_id: 118
            },
            {
                name_py: "benxishi",
                weathercnid: "101070501",
                name_en: "Benxi",
                name: "本溪市",
                city_id: 124
            },
            {
                name_py: "dandongshi",
                weathercnid: "101070601",
                name_en: "Dandong",
                name: "丹东市",
                city_id: 129
            },
            {
                name_py: "donggangshi",
                weathercnid: "101070604",
                name_en: "Donggang",
                name: "东港市",
                city_id: 130
            },
            {
                name_py: "fengchengshi",
                weathercnid: "101070602",
                name_en: "Fengcheng, Dandong",
                name: "凤城市",
                city_id: 131
            },
            {
                name_py: "jinzhoushi",
                weathercnid: "101070701",
                name_en: "Jinzhou, Liaoning",
                name: "锦州市",
                city_id: 135
            },
            {
                name_py: "linghaishi",
                weathercnid: "101070702",
                name_en: "Linghai",
                name: "凌海市",
                city_id: 136
            },
            {
                name_py: "beizhenshi",
                weathercnid: "101070706",
                name_en: "Beizhen",
                name: "北镇市",
                city_id: 137
            },
            {
                name_py: "yingkoushi",
                weathercnid: "101070801",
                name_en: "Yingkou",
                name: "营口市",
                city_id: 142
            },
            {
                name_py: "gaizhoushi",
                weathercnid: "101070803",
                name_en: "Gaizhou",
                name: "盖州市",
                city_id: 143
            },
            {
                name_py: "dashiqiaoshi",
                weathercnid: "101070802",
                name_en: "Dashiqiao",
                name: "大石桥市",
                city_id: 144
            },
            {
                name_py: "fuxinshi",
                weathercnid: "101070901",
                name_en: "Fuxin",
                name: "阜新市",
                city_id: 146
            },
            {
                name_py: "liaoyangshi",
                weathercnid: "101071001",
                name_en: "Liaoyang",
                name: "辽阳市",
                city_id: 150
            },
            {
                name_py: "dengtashi",
                weathercnid: "101071003",
                name_en: "Dengta",
                name: "灯塔市",
                city_id: 151
            },
            {
                name_py: "panjinshi",
                weathercnid: "101071301",
                name_en: "Panjin",
                name: "盘锦市",
                city_id: 154
            },
            {
                name_py: "tielingshi",
                weathercnid: "101071101",
                name_en: "Tieling",
                name: "铁岭市",
                city_id: 158
            },
            {
                name_py: "kaiyuanshi",
                weathercnid: "101071102",
                name_en: "Kaiyuan, Tieling",
                name: "开原市",
                city_id: 160
            },
            {
                name_py: "diaobingshanshi",
                weathercnid: "101071105",
                name_en: "Diaobingshan",
                name: "调兵山市",
                city_id: 164
            },
            {
                name_py: "chaoyangshi",
                weathercnid: "101071201",
                name_en: "Chaoyang",
                name: "朝阳市",
                city_id: 167
            },
            {
                name_py: "beipiaoshi",
                weathercnid: "101071205",
                name_en: "Beipiao",
                name: "北票市",
                city_id: 168
            },
            {
                name_py: "lingyuanshi",
                weathercnid: "101071203",
                name_en: "Lingyuan",
                name: "凌源市",
                city_id: 169
            },
            {
                name_py: "huludaoshi",
                weathercnid: "101071401",
                name_en: "Huludao",
                name: "葫芦岛市",
                city_id: 176
            },
            {
                name_py: "xingchengshi",
                weathercnid: "101071404",
                name_en: "Xingcheng",
                name: "兴城市",
                city_id: 177
            }
        ],
        name: "辽宁省"
    },
    {
        list: [
            {
                name_py: "hefeishi",
                weathercnid: "101220101",
                name_en: "Hefei",
                name: "合肥市",
                city_id: 1547
            },
            {
                name_py: "wuhushi",
                weathercnid: "101220301",
                name_en: "Wuhu",
                name: "芜湖市",
                city_id: 1552
            },
            {
                name_py: "bengbushi",
                weathercnid: "101220201",
                name_en: "Bengbu",
                name: "蚌埠市",
                city_id: 1557
            },
            {
                name_py: "huainanshi",
                weathercnid: "101220401",
                name_en: "Huainan",
                name: "淮南市",
                city_id: 1562
            },
            {
                name_py: "maanshanshi",
                weathercnid: "101220501",
                name_en: "Maanshan",
                name: "马鞍山市",
                city_id: 1566
            },
            {
                name_py: "huaibeishi",
                weathercnid: "101221201",
                name_en: "Huaibei",
                name: "淮北市",
                city_id: 1569
            },
            {
                name_py: "tonglingshi",
                weathercnid: "101221301",
                name_en: "Tongling",
                name: "铜陵市",
                city_id: 1572
            },
            {
                name_py: "anqingshi",
                weathercnid: "101220601",
                name_en: "Anqing",
                name: "安庆市",
                city_id: 1574
            },
            {
                name_py: "tongchengshi",
                weathercnid: "101220609",
                name_en: "Tongcheng",
                name: "桐城市",
                city_id: 1575
            },
            {
                name_py: "huangshanshi",
                weathercnid: "101221001",
                name_en: "Huangshan",
                name: "黄山市",
                city_id: 1584
            },
            {
                name_py: "chuzhoushi",
                weathercnid: "101221101",
                name_en: "Chuzhou",
                name: "滁州市",
                city_id: 1593
            },
            {
                name_py: "tianchangshi",
                weathercnid: "101221107",
                name_en: "Tianchang",
                name: "天长市",
                city_id: 1594
            },
            {
                name_py: "mingguangshi",
                weathercnid: "101221103",
                name_en: "Mingguang City",
                name: "明光市",
                city_id: 1595
            },
            {
                name_py: "fuyangshi",
                weathercnid: "101220801",
                name_en: "Fuyang",
                name: "阜阳市",
                city_id: 1601
            },
            {
                name_py: "jieshoushi",
                weathercnid: "101220805",
                name_en: "Jieshou",
                name: "界首市",
                city_id: 1602
            },
            {
                name_py: "suzhoushi",
                weathercnid: "101220701",
                name_en: "Suzhou, Anhui",
                name: "宿州市",
                city_id: 1608
            },
            {
                name_py: "chaohushi",
                weathercnid: "101220105",
                name_en: "Chaohu",
                name: "巢湖市",
                city_id: 1618
            },
            {
                name_py: "luanshi",
                weathercnid: "101221501",
                name_en: "Lu'an",
                name: "六安市",
                city_id: 1624
            },
            {
                name_py: "bozhoushi",
                weathercnid: "101220901",
                name_en: "Bozhou",
                name: "亳州市",
                city_id: 1631
            },
            {
                name_py: "chizhoushi",
                weathercnid: "101221701",
                name_en: "Chizhou",
                name: "池州市",
                city_id: 1637
            },
            {
                name_py: "xuanchengshi",
                weathercnid: "101221401",
                name_en: "Xuancheng",
                name: "宣城市",
                city_id: 1644
            },
            {
                name_py: "ningguoshi",
                weathercnid: "101221404",
                name_en: "Ningguo",
                name: "宁国市",
                city_id: 1646
            }
        ],
        name: "安徽省"
    },
    {
        list: [
            {
                name_py: "chengdushi",
                weathercnid: "101270101",
                name_en: "Chengdu",
                name: "成都市",
                city_id: 2635
            },
            {
                name_py: "dujiangyanshi",
                weathercnid: "101270111",
                name_en: "Dujiangyan",
                name: "都江堰市",
                city_id: 2638
            },
            {
                name_py: "pengzhoushi",
                weathercnid: "101270112",
                name_en: "Pengzhou",
                name: "彭州市",
                city_id: 2639
            },
            {
                name_py: "qionglaishi",
                weathercnid: "101270113",
                name_en: "Qionglai",
                name: "邛崃市",
                city_id: 2640
            },
            {
                name_py: "chongzhoushi",
                weathercnid: "101270114",
                name_en: "Chongzhou",
                name: "崇州市",
                city_id: 2641
            },
            {
                name_py: "zigongshi",
                weathercnid: "101270301",
                name_en: "Zigong",
                name: "自贡市",
                city_id: 2652
            },
            {
                name_py: "panzhihuashi",
                weathercnid: "101270201",
                name_en: "Panzhihua",
                name: "攀枝花市",
                city_id: 2656
            },
            {
                name_py: "luzhoushi",
                weathercnid: "101271001",
                name_en: "Luzhou",
                name: "泸州市",
                city_id: 2661
            },
            {
                name_py: "deyangshi",
                weathercnid: "101272001",
                name_en: "Deyang",
                name: "德阳市",
                city_id: 2668
            },
            {
                name_py: "guanghanshi",
                weathercnid: "101272003",
                name_en: "Guanghan",
                name: "广汉市",
                city_id: 2669
            },
            {
                name_py: "shifangshi",
                weathercnid: "101272004",
                name_en: "Shifang",
                name: "什邡市",
                city_id: 2670
            },
            {
                name_py: "mianzhushi",
                weathercnid: "101272005",
                name_en: "Mianzhu",
                name: "绵竹市",
                city_id: 2671
            },
            {
                name_py: "mianyangshi",
                weathercnid: "101270401",
                name_en: "Mianyang",
                name: "绵阳市",
                city_id: 2675
            },
            {
                name_py: "jiangyoushi",
                weathercnid: "101270408",
                name_en: "Jiangyou",
                name: "江油市",
                city_id: 2676
            },
            {
                name_py: "guangyuanshi",
                weathercnid: "101272101",
                name_en: "Guangyuan",
                name: "广元市",
                city_id: 2684
            },
            {
                name_py: "suiningshi",
                weathercnid: "101270701",
                name_en: "Suining",
                name: "遂宁市",
                city_id: 2690
            },
            {
                name_py: "neijiangshi",
                weathercnid: "101271201",
                name_en: "Neijiang",
                name: "内江市",
                city_id: 2694
            },
            {
                name_py: "leshanshi",
                weathercnid: "101271401",
                name_en: "Leshan",
                name: "乐山市",
                city_id: 2700
            },
            {
                name_py: "emeishanshi",
                weathercnid: "101271408",
                name_en: "Emeishan",
                name: "峨眉山市",
                city_id: 2708
            },
            {
                name_py: "nanchongshi",
                weathercnid: "101270501",
                name_en: "Nanchong",
                name: "南充市",
                city_id: 2711
            },
            {
                name_py: "langzhongshi",
                weathercnid: "101270507",
                name_en: "Langzhong",
                name: "阆中市",
                city_id: 2712
            },
            {
                name_py: "meishanshi",
                weathercnid: "101271501",
                name_en: "Meishan",
                name: "眉山市",
                city_id: 2719
            },
            {
                name_py: "yibinshi",
                weathercnid: "101271101",
                name_en: "Yibin",
                name: "宜宾市",
                city_id: 2726
            },
            {
                name_py: "guanganshi",
                weathercnid: "101270801",
                name_en: "Guangan",
                name: "广安市",
                city_id: 2737
            },
            {
                name_py: "huayingshi",
                weathercnid: "101270805",
                name_en: "Huaying",
                name: "华蓥市",
                city_id: 2738
            },
            {
                name_py: "wanyuanshi",
                weathercnid: "101270606",
                name_en: "Wanyuan",
                name: "万源市",
                city_id: 2743
            },
            {
                name_py: "dazhoushi",
                weathercnid: "101270601",
                name_en: "Dazhou",
                name: "达州市",
                city_id: 2749
            },
            {
                name_py: "yaanshi",
                weathercnid: "101271701",
                name_en: "Yaan",
                name: "雅安市",
                city_id: 2753
            },
            {
                name_py: "bazhongshi",
                weathercnid: "101270901",
                name_en: "Bazhong",
                name: "巴中市",
                city_id: 2762
            },
            {
                name_py: "ziyangshi",
                weathercnid: "101271301",
                name_en: "Ziyang",
                name: "资阳市",
                city_id: 2767
            },
            {
                name_py: "jianyangshi",
                weathercnid: "101271304",
                name_en: "Jianyang, Sichuan",
                name: "简阳市",
                city_id: 2768
            },
            {
                name_py: "maerkangshi",
                weathercnid: "101271910",
                name_en: "Maerkang (Barkam) ",
                name: "马尔康市",
                city_id: 2772
            },
            {
                name_py: "kangdingshi",
                weathercnid: "101271802",
                name_en: "Kangding (Dardo)",
                name: "康定市",
                city_id: 2788
            },
            {
                name_py: "xichangshi",
                weathercnid: "101271610",
                name_en: "Xichang",
                name: "西昌市",
                city_id: 2807
            }
        ],
        name: "四川省"
    }
];

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
        right: 60px;
        width: 64px;
        height: 54px;
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
        top: 11px;
        left: 10px;
        display: inline-block;
        width: 54px;
        height: 54px;
        background: url("../assets/icn_topbar_search_pressed.png") no-repeat;
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
    background: url("../assets/icn_instructions.png") no-repeat;
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
        background: url("../assets/icn__positioning.png") no-repeat;
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
    background-image: url(../assets/btn_input_delete_normal@2x.png);
    &:active {
        background-image: url(../assets/btn_input_delete_pressed@2x.png);
    }
}
</style>

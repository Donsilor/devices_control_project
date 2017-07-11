import Mock from 'mockjs';

export function getInitData(){  
    return {    
        "channels": [
            {
            "channelId": "001",
            "channel": "电影"
            },
            {
            "channelId": "002",
            "channel": "电视剧"
            },
            {
            "channelId": "003",
            "channel": "动漫"
            },
            {
            "channelId": "004",
            "channel": "综艺"
            }
        ],
        "homePageInfo": [
            {
                "title": "爱情保卫战",
                "sTitle": "",
                "channelId": "004",
                "pictureUrl": "http://puui.qpic.cn/tv/0/11335355_722354/0",
                "postUrl": "",
                "sourceId": "9",
                "vid": "8qx2ghgdjufkks6"
            }
        ]
    }
}

export function getChannelData() {
    return {
        "data": {
            "total": 8000,
            "pageNo": 1,
            "pageSize": 20,
            "list": [
                {
                    "title": "五个寂寞的心",
                    "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/d/dsjvcs7m3q1eqyn.jpg",
                    "starring": "施念慈 梁碧芝 谭卫兰 黄婉婷",
                    "director": "陈果",
                    "region": "香港",
                    "year": "1992",
                    "vid": "dsjvcs7m3q1eqyn",
                    "channelId": "001",
                    "channel": "电影",
                    "cate": "爱情",
                    "duration": "01:28:03",
                    "sourceId": "9",
                    "setCount": "",
                    "lastUpdateSet": "",
                    "site": "2017-03-01 03:00:00",
                    "ispay": "1",
                    "states": "1",
                    "hasPart": true,
                    "crawler": false
                }
            ],
            "category": [
                {"cate": "纪录片","cateId": "4359"},
                { "cate": "恐怖","cateId": "4361"},
            ],
            "region": [ 
                { "regionId": "4360", "region": "内地" }, 
                { "regionId": "4364", "region": "法国" }
            ],
            "year": [ 
                { "year": "2017", "yearrange": "2017-2017" }, 
                { "year": "2016", "yearrange": "2016-2016" }
            ]
	    }
    }
}

export function getDetaileData(){   
    return {    
          "getDetaileData": {
            "title": "特殊关系",
            "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/a/asbi8alnlba8sni.jpg",
            "starring": "麦克·辛 Michael Sheen 丹尼斯·奎德 Dennis Quaid 霍普·戴维斯 海伦·麦克洛瑞 Helen McCrory 马克·巴泽利",
            "director": "理查德·隆克瑞恩",
            "region": "英国",
            "year": "2010",
            "desc": "《特殊关系》讲述了1997年至2000年期间，当时的英国首相托尼·布莱尔与当时的美国总统比尔·克林顿之间的“亲密联系”，同时电影还将重点展现克林顿与白宫实习生莱温斯基在1995年到1997年期间的“不正当关系”，以及此事被曝光后是如何险些令克林顿下台的。",
            "cate": "剧情",
            "score": "6.79",
            "quality": "蓝光",
            "language": "英语",
            "duration": "01:28:30",
            "playlist": [
            {
                "sourceId": "9",
                "playparam": "tenvideo2://?action=7&video_id=&video_name=特殊关系&cover_id=asbi8alnlba8sni",
                "total": 1,
                "list": [
                {
                    "index": "1",
                    "name": "特殊关系",
                    "pictureUrl": "http://puui.qpic.cn/qqvideo_ori/0/x0022jyxl0p_228_128/0",
                    "duration": "01:28:30",
                    "states": "1",
                    "link": "tenvideo2://?action=7&video_id=x0022jyxl0p&video_name=特殊关系&cover_id=asbi8alnlba8sni"
                }
                ]
            }
            ]
        }

    }
}

export function searchData(){   
    return {
        "searchData": {
            "total": 9,
            "pageNo": 1,
            "pageSize": 20,
            "list": [
                {
                    "title": "辛巴达与美人鱼公主",
                    "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/m/m4ndd94h3u4unhc.jpg",
                    "starring": "王雪沁 杨进 唐泽宗 吴凡",
                    "director": "李霞",
                    "region": "内地",
                    "year": "2017",
                    "vid": "m4ndd94h3u4unhc",
                    "channelId": "001",
                    "channel": "电影",
                    "cate": "喜剧",
                    "duration": "01:20:14",
                    "sourceId": "9",
                    "setCount": "",
                    "lastUpdateSet": "",
                    "site": "2017-03-01 03:00:00",
                    "ispay": "5",
                    "states": "1",
                    "hasPart": true,
                    "crawler": false
                }
            ]
        }
    }
}

export function fuzzySearch(){  
    return {    
        "fuzzySearch": [
            "变形金刚4：绝迹重生",
            "变身小姐",
            "变态假面",
            "变化",
            "变色龙",
            "变身杀人事件",
            "变节",
            "变鬼3.2",
            "变装酷童",
            "变鬼3.1"
         ]
    }
}

export function getSearchHistory(){ 
    return {    
        "getSearchHistory": [
            "变形金刚",
            "中国嘻哈",
            "欢乐喜剧"
        ]
    }
}
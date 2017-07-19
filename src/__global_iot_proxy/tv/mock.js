import Mock from 'mockjs';

export function getInitData() {
    return JSON.stringify({
        "homePageInfo": [
            {
                "title": "我的前半生",
                "sTitle": "",
                "channelId": "002",
                "pictureUrl": "http:\/\/puui.qpic.cn\/tv\/0\/11301712_722354\/0",
                "postUrl": "",
                "sourceId": "9",
                "vid": "6oysp96a4pku9up"
            },
            {
                "title": "一条狗的使命",
                "sTitle": "",
                "channelId": "001",
                "pictureUrl": "http:\/\/puui.qpic.cn\/tv\/0\/9937170_722354\/0",
                "postUrl": "",
                "sourceId": "9",
                "vid": "950h5k5p7h7m2qn"
            },
            {
                "title": "奔跑吧 第13期 精编版",
                "sTitle": "",
                "channelId": "004",
                "pictureUrl": "http:\/\/puui.qpic.cn\/tv\/0\/11427977_722354\/0",
                "postUrl": "",
                "sourceId": "9",
                "vid": "oyn5yjpdug4l1dd"
            },
            {
                "title": "我们的少年时代",
                "sTitle": "",
                "channelId": "002",
                "pictureUrl": "http:\/\/puui.qpic.cn\/tv\/0\/11402155_722354\/0",
                "postUrl": "",
                "sourceId": "9",
                "vid": "e8sbq7ko8jvgcty"
            },
            {
                "title": "开心相对论 首播 完整版",
                "sTitle": "",
                "channelId": "004",
                "pictureUrl": "http:\/\/puui.qpic.cn\/tv\/0\/11432604_722354\/0",
                "postUrl": "",
                "sourceId": "9",
                "vid": "rf5jb15j96rkbro"
            }
        ],
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
        ]
    })
}

export function getChannelData() {
    return {
  "action": "getChannelData",
  "channelId": "001",
  "category": [
    {
      "cate": "纪录片",
      "cateId": "4359"
    },
    {
      "cate": "恐怖",
      "cateId": "4361"
    },
    {
      "cate": "喜剧",
      "cateId": "4363"
    },
    {
      "cate": "剧情",
      "cateId": "4366"
    },
    {
      "cate": "爱情",
      "cateId": "4367"
    },
    {
      "cate": "惊悚",
      "cateId": "4369"
    },
    {
      "cate": "动作",
      "cateId": "4373"
    },
    {
      "cate": "动画",
      "cateId": "4376"
    },
    {
      "cate": "电影",
      "cateId": "4377"
    },
    {
      "cate": "冒险",
      "cateId": "4379"
    },
    {
      "cate": "电影剪辑",
      "cateId": "4380"
    },
    {
      "cate": "儿童",
      "cateId": "4383"
    },
    {
      "cate": "同性",
      "cateId": "4384"
    },
    {
      "cate": "历史",
      "cateId": "4388"
    },
    {
      "cate": "家庭",
      "cateId": "4389"
    },
    {
      "cate": "犯罪",
      "cateId": "4392"
    },
    {
      "cate": "战争",
      "cateId": "4393"
    },
    {
      "cate": "科幻",
      "cateId": "4400"
    },
    {
      "cate": "悬疑",
      "cateId": "4407"
    },
    {
      "cate": "奇幻",
      "cateId": "4410"
    },
    {
      "cate": "武侠",
      "cateId": "4414"
    },
    {
      "cate": "纪录",
      "cateId": "4416"
    },
    {
      "cate": "传记",
      "cateId": "4422"
    },
    {
      "cate": "校园",
      "cateId": "4425"
    },
    {
      "cate": "歌舞",
      "cateId": "4426"
    },
    {
      "cate": "短片",
      "cateId": "4436"
    },
    {
      "cate": "西部",
      "cateId": "4439"
    },
    {
      "cate": "音乐",
      "cateId": "4443"
    },
    {
      "cate": "伦理",
      "cateId": "4447"
    },
    {
      "cate": "青春",
      "cateId": "4449"
    },
    {
      "cate": "古装",
      "cateId": "4450"
    },
    {
      "cate": "运动",
      "cateId": "4453"
    },
    {
      "cate": "励志",
      "cateId": "4470"
    },
    {
      "cate": "剪辑",
      "cateId": "4474"
    },
    {
      "cate": "亲情",
      "cateId": "4480"
    },
    {
      "cate": "神话",
      "cateId": "4485"
    },
    {
      "cate": "灾难",
      "cateId": "4487"
    },
    {
      "cate": "黑色",
      "cateId": "4489"
    },
    {
      "cate": "情色",
      "cateId": "4495"
    },
    {
      "cate": "其他",
      "cateId": "4498"
    },
    {
      "cate": "商战",
      "cateId": "4500"
    },
    {
      "cate": "公益",
      "cateId": "4510"
    },
    {
      "cate": "内地",
      "cateId": "5418"
    },
    {
      "cate": "黑社会",
      "cateId": "6651"
    },
    {
      "cate": "魔幻",
      "cateId": "9754"
    },
    {
      "cate": "复仇",
      "cateId": "12700"
    },
    {
      "cate": "院线",
      "cateId": "13655"
    }
  ],
  "region": [
    {
      "regionId": "4360",
      "region": "内地"
    },
    {
      "regionId": "4364",
      "region": "法国"
    },
    {
      "regionId": "4368",
      "region": "香港"
    },
    {
      "regionId": "4370",
      "region": "美国"
    },
    {
      "regionId": "4372",
      "region": "德国"
    },
    {
      "regionId": "4374",
      "region": "日本"
    }
  ],
  "year": [
    {
      "year": "2017",
      "yearrange": "2017-2017"
    },
    {
      "year": "2016",
      "yearrange": "2016-2016"
    },
    {
      "year": "2015",
      "yearrange": "2015-2015"
    },
    {
      "year": "2014",
      "yearrange": "2014-2014"
    },
    {
      "year": "2013",
      "yearrange": "2013-2013"
    },
    {
      "year": "2012",
      "yearrange": "2012-2012"
    },
    {
      "year": "2011",
      "yearrange": "2011-2011"
    },
    {
      "year": "2010",
      "yearrange": "2010-2010"
    },
    {
      "year": "00年代",
      "yearrange": "2000-2009"
    },
    {
      "year": "90年代",
      "yearrange": "1990-1999"
    }
  ],
  "data": {
    "total": 8000,
    "pageNo": 1,
    "pageSize": 10,
    "list": [
      {
        "title": "不期而遇",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/q/qqp3ehjrxmy2syz.jpg",
        "starring": "张亮 张雨绮",
        "director": "陈卓",
        "region": "内地",
        "year": "2017",
        "vid": "qqp3ehjrxmy2syz",
        "channelId": "001",
        "channel": "电影",
        "cate": "喜剧",
        "duration": "00:01:06",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "女法医手记（下）",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/u/ui0gvnq3ykcf9ir.jpg",
        "starring": "王维申 陈震 孟子叶 赵崔玮 于岩琴",
        "director": "贾杰",
        "region": "内地",
        "year": "2017",
        "vid": "ui0gvnq3ykcf9ir",
        "channelId": "001",
        "channel": "电影",
        "cate": "悬疑",
        "duration": "01:08:48",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "5",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "培根唠电影55：穿越大法好，法鲨实力带队五杀",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/o/orfz65pvzjprkjc.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "orfz65pvzjprkjc",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:10:48",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "最后的武林",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/v/viipyfs47mdgfkc.jpg",
        "starring": "子望 余斯昌 王子清 吴浚诚 何若鹤 唐鑫 侯昕炜",
        "director": "霍穗强",
        "region": "内地",
        "year": "2017",
        "vid": "viipyfs47mdgfkc",
        "channelId": "001",
        "channel": "电影",
        "cate": "喜剧",
        "duration": "01:13:23",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "5",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "培根唠电影54：Lalaland没听过瘾？萌宠陪你一起刷歌单",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/2/2zblewftc9wrszx.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "2zblewftc9wrszx",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:08:56",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "新片大判官",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/b/bgst17xflh74z59.jpg",
        "starring": "",
        "director": "",
        "region": "美国",
        "year": "0",
        "vid": "bgst17xflh74z59",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:07:01",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "培根唠电影53：被爱乐之城虐狗？还有美食猛男拯救你",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/h/h8xybnjvp4s80ew.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "h8xybnjvp4s80ew",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:13:30",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "玲安对话好莱坞：极限特工范迪塞尔秀身手",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/6/6544ivsrwrbl2y3.jpg",
        "starring": "",
        "director": "",
        "region": "美国",
        "year": "0",
        "vid": "6544ivsrwrbl2y3",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:12:57",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "麦田电影院  第93期：《胭脂扣》张国荣梅艳芳风流绝唱",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/u/u1jgkmc6p6gw9ok.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "u1jgkmc6p6gw9ok",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:18:06",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "腾讯电影沙龙：王宝强2016“九死一生”，绝不原地停留",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/v/vbxbol8daxndp6i.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "vbxbol8daxndp6i",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:05:45",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      }
    ]
  }
}
}

export function getDetaileData() {
    return {
        "data": {
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

export function searchData() {
    return {
        "data": {
            "total": 50,
            "pageNo": 1,
            "pageSize": 20,
            "list": [
      {
        "title": "不期而遇",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/q/qqp3ehjrxmy2syz.jpg",
        "starring": "张亮 张雨绮",
        "director": "陈卓",
        "region": "内地",
        "year": "2017",
        "vid": "qqp3ehjrxmy2syz",
        "channelId": "001",
        "channel": "电影",
        "cate": "喜剧",
        "duration": "00:01:06",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "女法医手记（下）",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/u/ui0gvnq3ykcf9ir.jpg",
        "starring": "王维申 陈震 孟子叶 赵崔玮 于岩琴",
        "director": "贾杰",
        "region": "内地",
        "year": "2017",
        "vid": "ui0gvnq3ykcf9ir",
        "channelId": "001",
        "channel": "电影",
        "cate": "悬疑",
        "duration": "01:08:48",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "5",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "培根唠电影55：穿越大法好，法鲨实力带队五杀",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/o/orfz65pvzjprkjc.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "orfz65pvzjprkjc",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:10:48",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "最后的武林",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/v/viipyfs47mdgfkc.jpg",
        "starring": "子望 余斯昌 王子清 吴浚诚 何若鹤 唐鑫 侯昕炜",
        "director": "霍穗强",
        "region": "内地",
        "year": "2017",
        "vid": "viipyfs47mdgfkc",
        "channelId": "001",
        "channel": "电影",
        "cate": "喜剧",
        "duration": "01:13:23",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "5",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "培根唠电影54：Lalaland没听过瘾？萌宠陪你一起刷歌单",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/2/2zblewftc9wrszx.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "2zblewftc9wrszx",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:08:56",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "新片大判官",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/b/bgst17xflh74z59.jpg",
        "starring": "",
        "director": "",
        "region": "美国",
        "year": "0",
        "vid": "bgst17xflh74z59",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:07:01",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "培根唠电影53：被爱乐之城虐狗？还有美食猛男拯救你",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/h/h8xybnjvp4s80ew.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "h8xybnjvp4s80ew",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:13:30",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "玲安对话好莱坞：极限特工范迪塞尔秀身手",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/6/6544ivsrwrbl2y3.jpg",
        "starring": "",
        "director": "",
        "region": "美国",
        "year": "0",
        "vid": "6544ivsrwrbl2y3",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:12:57",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "麦田电影院  第93期：《胭脂扣》张国荣梅艳芳风流绝唱",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/u/u1jgkmc6p6gw9ok.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "u1jgkmc6p6gw9ok",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:18:06",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      },
      {
        "title": "腾讯电影沙龙：王宝强2016“九死一生”，绝不原地停留",
        "pictureUrl": "http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/v/vbxbol8daxndp6i.jpg",
        "starring": "",
        "director": "",
        "region": "内地",
        "year": "0",
        "vid": "vbxbol8daxndp6i",
        "channelId": "001",
        "channel": "电影",
        "cate": "电影",
        "duration": "00:05:45",
        "sourceId": "9",
        "setCount": "",
        "lastUpdateSet": "",
        "site": "2017-03-01 03:00:00",
        "ispay": "1",
        "states": "1",
        "hasPart": true,
        "crawler": false
      }
            ]
        }
    }
}

export function fuzzySearch() {
    return {
        "data": [
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

export function getSearchHistory() {
    return {
        "data": [
            "变形金刚",
            "中国嘻哈",
            "欢乐喜剧"
        ]
    }
}
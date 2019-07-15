import Mock from 'mockjs'

export function getInitData() {
  return JSON.stringify({
    homePageInfo: [
      {
        title: '我的前半生',
        sTitle: '',
        channelId: '002',
        pictureUrl: 'http://puui.qpic.cn/tv/0/11301712_722354/0',
        postUrl: '',
        sourceId: '9',
        vid: '6oysp96a4pku9up'
      },
      {
        title: '一条狗的使命',
        sTitle: '',
        channelId: '001',
        pictureUrl: 'http://puui.qpic.cn/tv/0/9937170_722354/0',
        postUrl: '',
        sourceId: '9',
        vid: '950h5k5p7h7m2qn'
      },
      {
        title: '奔跑吧 第13期 精编版',
        sTitle: '',
        channelId: '004',
        pictureUrl: 'http://puui.qpic.cn/tv/0/11427977_722354/0',
        postUrl: '',
        sourceId: '9',
        vid: 'oyn5yjpdug4l1dd'
      },
      {
        title: '我们的少年时代',
        sTitle: '',
        channelId: '002',
        pictureUrl: 'http://puui.qpic.cn/tv/0/11402155_722354/0',
        postUrl: '',
        sourceId: '9',
        vid: 'e8sbq7ko8jvgcty'
      },
      {
        title: '开心相对论 首播 完整版',
        sTitle: '',
        channelId: '004',
        pictureUrl: 'http://puui.qpic.cn/tv/0/11432604_722354/0',
        postUrl: '',
        sourceId: '9',
        vid: 'rf5jb15j96rkbro'
      }
    ],
    channels: [
      {
        channelId: '001',
        channel: '电影'
      },
      {
        channelId: '002',
        channel: '电视剧'
      },
      {
        channelId: '003',
        channel: '动漫'
      },
      {
        channelId: '004',
        channel: '综艺'
      }
    ]
  })
}

export function getChannelData() {
  return {
    action: 'getChannelData',
    channelId: '001',
    category: [
      { cate: '剧情', cateId: '剧情' },
      { cate: '喜剧', cateId: '喜剧' },
      { cate: '动作', cateId: '动作' },
      { cate: '爱情', cateId: '爱情' },
      { cate: '惊悚', cateId: '惊悚' },
      { cate: '犯罪', cateId: '犯罪' },
      { cate: '动画', cateId: '动画' },
      { cate: '战争', cateId: '战争' },
      { cate: '悬疑', cateId: '悬疑' },
      { cate: '冒险', cateId: '冒险' }
    ],
    region: [
      { region: '内地', regionId: '内地' },
      { region: '香港', regionId: '香港' },
      { region: '台湾', regionId: '台湾' },
      { region: '美国', regionId: '美国' },
      { region: '日本', regionId: '日本' },
      { region: '英国', regionId: '英国' },
      { region: '法国', regionId: '法国' },
      { region: '加拿大', regionId: '加拿大' },
      { region: '西班牙', regionId: '西班牙' },
      { region: '德国', regionId: '德国' }
    ],
    year: [
      { year: '2017', yearrange: '2017-2017' },
      { year: '2016', yearrange: '2016-2016' },
      { year: '2015', yearrange: '2015-2015' },
      { year: '2014', yearrange: '2014-2014' },
      { year: '2013', yearrange: '2013-2013' },
      { year: '2012', yearrange: '2012-2012' },
      { year: '2011', yearrange: '2011-2011' },
      { year: '2010', yearrange: '2010-2010' },
      { year: '00年代', yearrange: '2000-2009' },
      { year: '90年代', yearrange: '1990-1999' }
    ],
    data: {
      total: 6201,
      pageNo: 1,
      pageSize: 20,
      list: [
        {
          title: '九天玄鸟',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/6/6e6kfdou0y303wl.jpg',
          starring: '薛飞;张楚楚;樊锦霖;石磊;叮当',
          director: '于敏',
          region: '内地',
          year: '2017',
          vid: '6e6kfdou0y303wl',
          channelId: '001',
          channel: '电影',
          cate: '古装',
          duration: '01:03:10',
          sourceId: '9',
          site:
            'cover_id=6e6kfdou0y303wl|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=九天玄鸟|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '弄江湖之情到深处',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/4/4tal109f237sd8v.jpg',
          starring: '程远;董成明;陈熙明;朱建华',
          director: '郑骏',
          region: '内地',
          year: '2017',
          vid: '4tal109f237sd8v',
          channelId: '001',
          channel: '电影',
          cate: '动作',
          duration: '01:44:52',
          sourceId: '9',
          site:
            'cover_id=4tal109f237sd8v|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=弄江湖之情到深处|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '《建军大业》独家纪录片',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/r/rlfsj5swk59fhpy.jpg',
          starring: '刘烨;朱亚文;黄志忠;王景春;刘昊然;欧豪',
          director: '甘露',
          region: '内地',
          year: '2017',
          vid: 'rlfsj5swk59fhpy',
          channelId: '001',
          channel: '电影',
          cate: '纪录片',
          duration: '02:40:43',
          sourceId: '9',
          site:
            'cover_id=rlfsj5swk59fhpy|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=《建军大业》独家纪录片|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '巡楼人之舞灵',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/p/pntxsggkuew31gn.jpg',
          starring: '刘莹莹;李诗韵;杜爽;胡世闻;郝凌云',
          director: '佟皓宇',
          region: '内地',
          year: '2017',
          vid: 'pntxsggkuew31gn',
          channelId: '001',
          channel: '电影',
          cate: '惊悚',
          duration: '00:59:47',
          sourceId: '9',
          site:
            'cover_id=pntxsggkuew31gn|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=巡楼人之舞灵|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '热血杨家将',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/o/owost4o27zsy86w.jpg',
          starring: '傅汉源;曲夏雯;黄靖翔;鲍明;乙帅;马哲文',
          director: '傅闱玮',
          region: '内地',
          year: '2017',
          vid: 'owost4o27zsy86w',
          channelId: '001',
          channel: '电影',
          cate: '动作',
          duration: '01:23:28',
          sourceId: '9',
          site:
            'cover_id=owost4o27zsy86w|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=热血杨家将|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '爱爱囧事2',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/g/gk216r17aa9oaq1.jpg',
          starring: '向昊;李小晶',
          director: '关尔',
          region: '内地',
          year: '2017',
          vid: 'gk216r17aa9oaq1',
          channelId: '001',
          channel: '电影',
          cate: '爱情',
          duration: '01:49:42',
          sourceId: '9',
          site:
            'cover_id=gk216r17aa9oaq1|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=爱爱囧事2|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '绝世高手',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/t/tn2oe8hvr9g9a0a.jpg',
          starring:
            '卢正雨;郭采洁;范伟;蔡国庆;陈冲;仓田保昭;孔连顺;黄龄;杨迪;柯达;艾伦',
          director: '卢正雨',
          region: '内地',
          year: '2017',
          vid: 'tn2oe8hvr9g9a0a',
          channelId: '001',
          channel: '电影',
          cate: '喜剧',
          duration: '01:55:54',
          sourceId: '9',
          site:
            'cover_id=tn2oe8hvr9g9a0a|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=绝世高手|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '北纬30度之爱',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/d/d70mw0stx90l39w.jpg',
          starring: '陈思娜;肖宏;毛渤陇;兰卡初',
          director: '华原',
          region: '内地',
          year: '2017',
          vid: 'd70mw0stx90l39w',
          channelId: '001',
          channel: '电影',
          cate: '爱情',
          duration: '01:29:37',
          sourceId: '9',
          site:
            'cover_id=d70mw0stx90l39w|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=北纬30度之爱|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '超能电竞',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/l/ljtniw6fcfijrqh.jpg',
          starring: '李欣雨;苏鑫;陈若仪;李烨彤',
          director: '陈奏鸣',
          region: '内地',
          year: '2017',
          vid: 'ljtniw6fcfijrqh',
          channelId: '001',
          channel: '电影',
          cate: '剧情',
          duration: '01:14:47',
          sourceId: '9',
          site:
            'cover_id=ljtniw6fcfijrqh|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=超能电竞|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '29+1',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/c/cld0v6tqfiiox40.jpg',
          starring: '周秀娜;郑欣宜;蔡瀚亿;梁祖尧;金燕玲',
          director: '彭秀慧',
          region: '香港',
          year: '2017',
          vid: 'cld0v6tqfiiox40',
          channelId: '001',
          channel: '电影',
          cate: '剧情',
          duration: '01:50:21',
          sourceId: '9',
          site:
            'cover_id=cld0v6tqfiiox40|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=29+1|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '牧野传奇',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/i/ix1j98xuytaqtd3.jpg',
          starring: '',
          director: '谢宝锐',
          region: '内地',
          year: '2017',
          vid: 'ix1j98xuytaqtd3',
          channelId: '001',
          channel: '电影',
          cate: '动画',
          duration: '01:21:00',
          sourceId: '9',
          site:
            'cover_id=ix1j98xuytaqtd3|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=牧野传奇|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '乡关何处',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/e/e5dxonf823kyl0x.jpg',
          starring: '陈天星;江若琳;罗蓝山;高瑕',
          director: '胡艺川',
          region: '内地',
          year: '2017',
          vid: 'e5dxonf823kyl0x',
          channelId: '001',
          channel: '电影',
          cate: '剧情',
          duration: '01:35:31',
          sourceId: '9',
          site:
            'cover_id=e5dxonf823kyl0x|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=乡关何处|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '大宋奇闻录',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/g/gteiuqhevnumkbx.jpg',
          starring: '刘羽琦;沈驰;梅年佳',
          director: '范向南',
          region: '内地',
          year: '2017',
          vid: 'gteiuqhevnumkbx',
          channelId: '001',
          channel: '电影',
          cate: '喜剧',
          duration: '01:05:50',
          sourceId: '9',
          site:
            'cover_id=gteiuqhevnumkbx|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=大宋奇闻录|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '逆时营救',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/i/ia928vxnnvkemp5.jpg',
          starring: '杨幂;霍建华;金士杰;刘畅;张艺瀚',
          director: '尹鸿承',
          region: '内地',
          year: '2017',
          vid: 'ia928vxnnvkemp5',
          channelId: '001',
          channel: '电影',
          cate: '动作',
          duration: '01:45:44',
          sourceId: '9',
          site:
            'cover_id=ia928vxnnvkemp5|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=逆时营救|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '八仙归位',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/v/vanuonwsjhia3ng.jpg',
          starring: '赵滨;桑娜;郑拓疆;舒雅;老豹;张庭夫',
          director: '麦田',
          region: '内地',
          year: '2017',
          vid: 'vanuonwsjhia3ng',
          channelId: '001',
          channel: '电影',
          cate: '爱情',
          duration: '01:18:32',
          sourceId: '9',
          site:
            'cover_id=vanuonwsjhia3ng|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=八仙归位|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '雄狮',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/l/lanev22p4t6mych.jpg',
          starring: '戴夫·帕特尔;妮可·基德曼;鲁妮·玛拉;大卫·文翰;桑尼·帕沃',
          director: '加斯·戴维斯',
          region: '澳大利亚',
          year: '2017',
          vid: 'lanev22p4t6mych',
          channelId: '001',
          channel: '电影',
          cate: '剧情',
          duration: '01:58:32',
          sourceId: '9',
          site:
            'cover_id=lanev22p4t6mych|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=雄狮|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '冈仁波齐',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/w/w3ieh3f84a1kjqb.jpg',
          starring: '尼玛扎堆;杨培;斯朗卓嘎;次仁曲珍;色巴江措',
          director: '张杨',
          region: '内地',
          year: '2017',
          vid: 'w3ieh3f84a1kjqb',
          channelId: '001',
          channel: '电影',
          cate: '纪录片',
          duration: '01:53:03',
          sourceId: '9',
          site:
            'cover_id=w3ieh3f84a1kjqb|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=冈仁波齐|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '伪装大师（上）',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/k/k5kh8jjhkhxujeb.jpg',
          starring: '陈启杰;高雨儿;张炜迅;夏星;张惠程;杨静;闫锐',
          director: '刘亚当',
          region: '内地',
          year: '2017',
          vid: 'k5kh8jjhkhxujeb',
          channelId: '001',
          channel: '电影',
          cate: '冒险',
          duration: '01:03:27',
          sourceId: '9',
          site:
            'cover_id=k5kh8jjhkhxujeb|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=伪装大师（上）|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '我们停战吧',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/d/drx86adsnil6f5z.jpg',
          starring: '林文龙;林熹瞳;谭耀文;汤怡',
          director: '陆天华',
          region: '香港',
          year: '2017',
          vid: 'drx86adsnil6f5z',
          channelId: '001',
          channel: '电影',
          cate: '爱情',
          duration: '01:33:06',
          sourceId: '9',
          site:
            'cover_id=drx86adsnil6f5z|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=我们停战吧|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        },
        {
          title: '伪装大师（下）',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/k/kh8ot2r3vbmd8mb.jpg',
          starring: '陈启杰;高雨儿;张炜迅;夏星;张惠程;杨静;闫锐',
          director: '',
          region: '内地',
          year: '2017',
          vid: 'kh8ot2r3vbmd8mb',
          channelId: '001',
          channel: '电影',
          cate: '冒险',
          duration: '00:58:49',
          sourceId: '9',
          site:
            'cover_id=kh8ot2r3vbmd8mb|version=1|episode_idx=-1|channel_code=1|video_id=|video_name=伪装大师（下）|topic_id=|showtype=100',
          ispay: '5',
          states: '1',
          hasPart: true
        }
      ]
    }
  }
}

export function getDetaileData() {
  return {
    errorcode: '0',
    errormsg: 'success',
    data: {
      title: '极限挑战 第3季',
      pictureUrl:
        'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/k/k30wb9haj8060ba.jpg',
      starring:
        '张艺兴;孙红雷;王迅;黄渤;黄磊;罗志祥;姚晨;林志玲;张歆艺;王珞丹;江一燕',
      director: '有引号',
      region: '内地',
      year: '',
      desc:
        '《极限挑战第5季》2019年5月12日起每周日晚爱奇艺全网首播。《极限挑战第5季》东方卫视推出的互动励志体验节目，本季固定成员是罗志祥、张艺兴、王迅、迪丽热巴、岳云鹏、雷佳音。成员们从上海出发一路沿江体验，在长江这条黄金水道上迎接一个又一个“挑战”，展现沿线各地的文化之美、建设之美、生态之美，携手沿途美好生活的创造者、守护者，在奋斗中收获更多自信和勇气。',
      cate: '明星真人秀',
      score: '',
      quality: '超清',
      language: '',
      duration: '01:37:22',
      playlist: [
        {
          sourceId: '9',
          playparam:
            'tenvideo2://?action=7&video_id=&video_name=极限挑战 第3季&cover_id=k30wb9haj8060ba',
          total: 37,
          list: [
            {
              index: '1',
              name: '第6期：男人帮五美玩狼人杀，颜王姚晨牵手结盟',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/n0024ah3pwt_228_128/0',
              duration: '01:37:22',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=n0024ah3pwt&video_name=第6期：男人帮五美玩狼人杀，颜王姚晨牵手结盟&cover_id=k30wb9haj8060ba'
            },
            {
              index: '2',
              name: '未播：姚晨王珞丹模仿孙红雷跳舞，黄渤创意裁剪燕尾服',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/c00240oq2om_228_128/0',
              duration: '00:02:05',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=c00240oq2om&video_name=未播：姚晨王珞丹模仿孙红雷跳舞，黄渤创意裁剪燕尾服&cover_id=k30wb9haj8060ba'
            },
            {
              index: '3',
              name: '未播：黄磊神逻辑上线！算猜拳牌机智提示罗志祥',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/g0024cnw1sp_228_128/0',
              duration: '00:03:19',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=g0024cnw1sp&video_name=未播：黄磊神逻辑上线！算猜拳牌机智提示罗志祥&cover_id=k30wb9haj8060ba'
            },
            {
              index: '4',
              name: '孙红雷cut：颜王模仿姚晨大嘴超魔性 幸福结盟变话唠',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/f0024e4r4b8_228_128/0',
              duration: '01:04:01',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=f0024e4r4b8&video_name=孙红雷cut：颜王模仿姚晨大嘴超魔性 幸福结盟变话唠&cover_id=k30wb9haj8060ba'
            },
            {
              index: '5',
              name: '感动！张艺兴听姚晨朗诵一封家书流泪不止',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/i0024psjtij_228_128/0',
              duration: '00:04:59',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=i0024psjtij&video_name=感动！张艺兴听姚晨朗诵一封家书流泪不止&cover_id=k30wb9haj8060ba'
            },
            {
              index: '6',
              name: '男人帮五美再度集结 斗智互坑残酷升级！',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/t002469xfli_228_128/0',
              duration: '00:03:50',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=t002469xfli&video_name=男人帮五美再度集结 斗智互坑残酷升级！&cover_id=k30wb9haj8060ba'
            },
            {
              index: '7',
              name: '张艺兴惨遭流放荒岛 露天啃面包要哭了',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/g0024g3kdjb_228_128/0',
              duration: '00:03:52',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=g0024g3kdjb&video_name=张艺兴惨遭流放荒岛 露天啃面包要哭了&cover_id=k30wb9haj8060ba'
            },
            {
              index: '8',
              name: '孙红雷林志玲沙滩尬舞 颜王变狼外婆表情阴险',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/t0024doxq76_228_128/0',
              duration: '00:03:21',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=t0024doxq76&video_name=孙红雷林志玲沙滩尬舞 颜王变狼外婆表情阴险&cover_id=k30wb9haj8060ba'
            },
            {
              index: '9',
              name: '罗志祥神模仿张艺兴上线！黄磊变神算子carry全场？',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/l0024oi88v9_228_128/0',
              duration: '00:03:54',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=l0024oi88v9&video_name=罗志祥神模仿张艺兴上线！黄磊变神算子carry全场？&cover_id=k30wb9haj8060ba'
            },
            {
              index: '10',
              name: '扑朔迷离！志玲姐姐其实一直在演戏？',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/j0024n9tiy8_228_128/0',
              duration: '00:04:17',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=j0024n9tiy8&video_name=扑朔迷离！志玲姐姐其实一直在演戏？&cover_id=k30wb9haj8060ba'
            },
            {
              index: '11',
              name: '孙红雷露“狼尾巴"遭怀疑？！颜王都快笑僵了',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/v0024zh13w4_228_128/0',
              duration: '00:05:53',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=v0024zh13w4&video_name=孙红雷露“狼尾巴"遭怀疑？！颜王都快笑僵了&cover_id=k30wb9haj8060ba'
            },
            {
              index: '12',
              name: '张艺兴黄渤疯狂抢电话 孙红雷姚晨牵手转圈跳舞',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/w0024uz97hr_228_128/0',
              duration: '00:05:38',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=w0024uz97hr&video_name=张艺兴黄渤疯狂抢电话 孙红雷姚晨牵手转圈跳舞&cover_id=k30wb9haj8060ba'
            },
            {
              index: '13',
              name: '这一刻等太久！孙红雷结盟姚晨幸福变话唠',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/p0024idl4k1_228_128/0',
              duration: '00:04:29',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=p0024idl4k1&video_name=这一刻等太久！孙红雷结盟姚晨幸福变话唠&cover_id=k30wb9haj8060ba'
            },
            {
              index: '14',
              name: '渤哥看傻了 王珞丹穿20多条裙子还这么瘦！',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/u0024r6gm6y_228_128/0',
              duration: '00:03:13',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=u0024r6gm6y&video_name=渤哥看傻了 王珞丹穿20多条裙子还这么瘦！&cover_id=k30wb9haj8060ba'
            },
            {
              index: '15',
              name: '张艺兴吃芥末水果被辣哭 张歆艺吃一口吐了···',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/p0024cprb7y_228_128/0',
              duration: '00:04:29',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=p0024cprb7y&video_name=张艺兴吃芥末水果被辣哭 张歆艺吃一口吐了···&cover_id=k30wb9haj8060ba'
            },
            {
              index: '16',
              name: '大松鼠呲牙吃冰棍儿 张艺兴又又又被黄渤骗了！',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/z002424ha77_228_128/0',
              duration: '00:05:37',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=z002424ha77&video_name=大松鼠呲牙吃冰棍儿 张艺兴又又又被黄渤骗了！&cover_id=k30wb9haj8060ba'
            },
            {
              index: '17',
              name: '孙红雷跪地求小猪结盟？！连姚晨都上来帮忙扇风',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/b0024m5b3hr_228_128/0',
              duration: '00:04:15',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=b0024m5b3hr&video_name=孙红雷跪地求小猪结盟？！连姚晨都上来帮忙扇风&cover_id=k30wb9haj8060ba'
            },
            {
              index: '18',
              name: '张艺兴拥抱黄磊求安慰 江一燕心系王迅做卧底',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/f0024y8n33j_228_128/0',
              duration: '00:03:53',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=f0024y8n33j&video_name=张艺兴拥抱黄磊求安慰 江一燕心系王迅做卧底&cover_id=k30wb9haj8060ba'
            },
            {
              index: '19',
              name: '张艺兴海边大战王迅 一出手小绵羊就笑疯了',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/f0024mqphvy_228_128/0',
              duration: '00:04:06',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=f0024mqphvy&video_name=张艺兴海边大战王迅 一出手小绵羊就笑疯了&cover_id=k30wb9haj8060ba'
            },
            {
              index: '20',
              name: '孙红雷为保姚晨安全挺身冒险 颜王堵林志玲谈判！',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/l0024pdra3w_228_128/0',
              duration: '00:04:53',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=l0024pdra3w&video_name=孙红雷为保姚晨安全挺身冒险 颜王堵林志玲谈判！&cover_id=k30wb9haj8060ba'
            },
            {
              index: '21',
              name: '张歆艺被骗委屈落泪！三精合伙挖坑尴尬了',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/g0024azqufc_228_128/0',
              duration: '00:03:05',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=g0024azqufc&video_name=张歆艺被骗委屈落泪！三精合伙挖坑尴尬了&cover_id=k30wb9haj8060ba'
            },
            {
              index: '22',
              name: '张艺兴海边中二练神功 黄渤呲牙尬舞PK孙红雷',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/v002497seyd_228_128/0',
              duration: '00:03:32',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=v002497seyd&video_name=张艺兴海边中二练神功 黄渤呲牙尬舞PK孙红雷&cover_id=k30wb9haj8060ba'
            },
            {
              index: '23',
              name: '孙红雷模仿姚晨大嘴超魔性 张艺兴玩游戏撒娇不玩了？',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/j0024apr08e_228_128/0',
              duration: '00:05:00',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=j0024apr08e&video_name=孙红雷模仿姚晨大嘴超魔性 张艺兴玩游戏撒娇不玩了？&cover_id=k30wb9haj8060ba'
            },
            {
              index: '24',
              name: '孙红雷为蹭车又跳舞 王珞丹对霹雳舞是真爱！',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/g00249do6ue_228_128/0',
              duration: '00:04:50',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=g00249do6ue&video_name=孙红雷为蹭车又跳舞 王珞丹对霹雳舞是真爱！&cover_id=k30wb9haj8060ba'
            },
            {
              index: '25',
              name: '王迅回忆23年当兵经历 通信兵艰苦生活感动男人帮',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/o0024domy9h_228_128/0',
              duration: '00:03:30',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=o0024domy9h&video_name=王迅回忆23年当兵经历 通信兵艰苦生活感动男人帮&cover_id=k30wb9haj8060ba'
            },
            {
              index: '26',
              name: '番外：黄渤竟然“背叛"了！林志玲：我们分手！',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/t00249cztve_228_128/0',
              duration: '00:03:24',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=t00249cztve&video_name=番外：黄渤竟然“背叛"了！林志玲：我们分手！&cover_id=k30wb9haj8060ba'
            },
            {
              index: '27',
              name: '上集：罗志祥神模仿张艺兴！颜王露“狼尾巴"遭怀疑',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/o00240vdurh_228_128/0',
              duration: '00:41:31',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=o00240vdurh&video_name=上集：罗志祥神模仿张艺兴！颜王露“狼尾巴"遭怀疑&cover_id=k30wb9haj8060ba'
            },
            {
              index: '28',
              name: '中集：张艺兴吃芥末被辣哭。孙红雷为保姚晨挺身冒险',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/q0024eott6n_228_128/0',
              duration: '00:27:53',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=q0024eott6n&video_name=中集：张艺兴吃芥末被辣哭。孙红雷为保姚晨挺身冒险&cover_id=k30wb9haj8060ba'
            },
            {
              index: '29',
              name: '下集：张歆艺被骗委屈落泪 张艺兴玩游戏撒娇',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/p0024wsynwh_228_128/0',
              duration: '00:24:24',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=p0024wsynwh&video_name=下集：张歆艺被骗委屈落泪 张艺兴玩游戏撒娇&cover_id=k30wb9haj8060ba'
            },
            {
              index: '30',
              name: '抢先看：黄渤林志玲起争执？姚晨孙红雷牵手结盟！',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/k0024xw8w5p_228_128/0',
              duration: '00:14:44',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=k0024xw8w5p&video_name=抢先看：黄渤林志玲起争执？姚晨孙红雷牵手结盟！&cover_id=k30wb9haj8060ba'
            },
            {
              index: '31',
              name: '第6期抢先看：男人帮与五美玩狼人杀，王迅心急引众人怀疑',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/b0024g3tida_228_128/0',
              duration: '00:03:05',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=b0024g3tida&video_name=第6期抢先看：男人帮与五美玩狼人杀，王迅心急引众人怀疑&cover_id=k30wb9haj8060ba'
            },
            {
              index: '32',
              name: '第6期预告：致敬最可爱的人，黄渤为孙红雷“裁新衣”',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/l0024d54ypd_228_128/0',
              duration: '00:04:02',
              states: '2',
              link:
                'tenvideo2://?action=7&video_id=l0024d54ypd&video_name=第6期预告：致敬最可爱的人，黄渤为孙红雷“裁新衣”&cover_id=k30wb9haj8060ba'
            },
            {
              index: '33',
              name: '幕后：极限男人帮和极限“五美”的复杂关系、恩怨情仇',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/b0537v8e5ig_228_128/0',
              duration: '00:03:55',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=b0537v8e5ig&video_name=幕后：极限男人帮和极限“五美”的复杂关系、恩怨情仇&cover_id=k30wb9haj8060ba'
            },
            {
              index: '34',
              name: '幕后：剧本和剪辑都有毒？总导演揭秘第6期的男人帮与五美',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/y0537noru3g_228_128/0',
              duration: '00:05:20',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=y0537noru3g&video_name=幕后：剧本和剪辑都有毒？总导演揭秘第6期的男人帮与五美&cover_id=k30wb9haj8060ba'
            },
            {
              index: '35',
              name: '番外：罗志祥张艺兴PK乒乓球 姚晨大嘴遭吐槽',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/v0024s723b3_228_128/0',
              duration: '00:03:22',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=v0024s723b3&video_name=番外：罗志祥张艺兴PK乒乓球 姚晨大嘴遭吐槽&cover_id=k30wb9haj8060ba'
            },
            {
              index: '36',
              name: '男人帮集体下跪拜师张艺兴，吓得小绵羊一边阻止一边回跪',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/q0024mn1pkw_228_128/0',
              duration: '00:00:27',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=q0024mn1pkw&video_name=男人帮集体下跪拜师张艺兴，吓得小绵羊一边阻止一边回跪&cover_id=k30wb9haj8060ba'
            },
            {
              index: '37',
              name: '第7期预告：男人帮与夏雨空降三星堆，变三千年前部落勇士',
              pictureUrl:
                'http://puui.qpic.cn/qqvideo_ori/0/s0024xlb7ym_228_128/0',
              duration: '00:03:26',
              states: '1',
              link:
                'tenvideo2://?action=7&video_id=s0024xlb7ym&video_name=第7期预告：男人帮与夏雨空降三星堆，变三千年前部落勇士&cover_id=k30wb9haj8060ba'
            }
          ]
        }
      ]
    }
  }
}

export function searchData(data) {
  return {
    errorcode: '0',
    data: {
      total: 31,
      pageNo: 1,
      pageSize: 20,
      channelId: data.params.channelId,
      list: [
        {
          title: '不期而遇',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/images/newcolumn/v1//t/t66zqv.jpg',
          starring: '张亮 张雨绮',
          director: '陈卓',
          region: '内地',
          year: '2017',
          vid: 'qqp3ehjrxmy2syz',
          channelId: '001',
          channel: '电影',
          cate: '喜剧',
          duration: '00:01:06',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '女法医手记（下）',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/u/ui0gvnq3ykcf9ir.jpg',
          starring: '王维申 陈震 孟子叶 赵崔玮 于岩琴',
          director: '贾杰',
          region: '内地',
          year: '2017',
          vid: 'ui0gvnq3ykcf9ir',
          channelId: '001',
          channel: '电影',
          cate: '悬疑',
          duration: '01:08:48',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '5',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '培根唠电影55：穿越大法好，法鲨实力带队五杀',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/o/orfz65pvzjprkjc.jpg',
          starring: '',
          director: '',
          region: '内地',
          year: '0',
          vid: 'orfz65pvzjprkjc',
          channelId: '001',
          channel: '电影',
          cate: '电影',
          duration: '00:10:48',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '最后的武林',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/v/viipyfs47mdgfkc.jpg',
          starring: '子望 余斯昌 王子清 吴浚诚 何若鹤 唐鑫 侯昕炜',
          director: '霍穗强',
          region: '内地',
          year: '2017',
          vid: 'viipyfs47mdgfkc',
          channelId: '001',
          channel: '电影',
          cate: '喜剧',
          duration: '01:13:23',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '5',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '培根唠电影54：Lalaland没听过瘾？萌宠陪你一起刷歌单',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/2/2zblewftc9wrszx.jpg',
          starring: '',
          director: '',
          region: '内地',
          year: '0',
          vid: '2zblewftc9wrszx',
          channelId: '001',
          channel: '电影',
          cate: '电影',
          duration: '00:08:56',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '新片大判官',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/b/bgst17xflh74z59.jpg',
          starring: '',
          director: '',
          region: '美国',
          year: '0',
          vid: 'bgst17xflh74z59',
          channelId: '001',
          channel: '电影',
          cate: '电影',
          duration: '00:07:01',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '培根唠电影53：被爱乐之城虐狗？还有美食猛男拯救你',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/h/h8xybnjvp4s80ew.jpg',
          starring: '',
          director: '',
          region: '内地',
          year: '0',
          vid: 'h8xybnjvp4s80ew',
          channelId: '001',
          channel: '电影',
          cate: '电影',
          duration: '00:13:30',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '玲安对话好莱坞：极限特工范迪塞尔秀身手',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/6/6544ivsrwrbl2y3.jpg',
          starring: '',
          director: '',
          region: '美国',
          year: '0',
          vid: '6544ivsrwrbl2y3',
          channelId: '001',
          channel: '电影',
          cate: '电影',
          duration: '00:12:57',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '麦田电影院  第93期：《胭脂扣》张国荣梅艳芳风流绝唱',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/u/u1jgkmc6p6gw9ok.jpg',
          starring: '',
          director: '',
          region: '内地',
          year: '0',
          vid: 'u1jgkmc6p6gw9ok',
          channelId: '001',
          channel: '电影',
          cate: '电影',
          duration: '00:18:06',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        },
        {
          title: '腾讯电影沙龙：王宝强2016“九死一生”，绝不原地停留',
          pictureUrl:
            'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/v/vbxbol8daxndp6i.jpg',
          starring: '',
          director: '',
          region: '内地',
          year: '0',
          vid: 'vbxbol8daxndp6i',
          channelId: '001',
          channel: '电影',
          cate: '电影',
          duration: '00:05:45',
          sourceId: '9',
          setCount: '',
          lastUpdateSet: '',
          site: '2017-03-01 03:00:00',
          ispay: '1',
          states: '1',
          hasPart: true,
          crawler: false
        }
      ]
    }
  }
}

export function fuzzySearch() {
  return {
    data: [
      '变形金刚4：绝迹重生',
      '变身小姐',
      '变态假面',
      '变化',
      '变色龙',
      '变身杀人事件',
      '变节',
      '变鬼3.2',
      '变装酷童',
      '变鬼3.1'
    ]
  }
}

export function getSearchHistory() {
  return {
    data: ['变形金刚', '中国嘻哈', '欢乐喜剧']
  }
}

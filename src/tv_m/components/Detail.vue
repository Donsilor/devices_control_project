<!--
    详情页
-->
<template>
<!-- <transition name="slideup"> -->
    <div class="page-detail" v-show="visible">
        <div class="detail-hd">
            <span class="back" @click="close"></span>
            <div class="title">
                {{loading?'正在加载中...':cur.title}}
                <span class="isvip" v-show="!loading && ispay && ispay !== '1'">付费</span>
            </div>
        </div>
        <status-tip class="sp_status_detail" />
        <div class="detail-bd">
        <div class="detail-info clearfix" v-show="cur.title">
            <div class="info-inner">
                <div class="pic">
                    <img v-lazy="cur.pictureUrl" :class="['pic-'+channelId]">
                </div>
                <div class="text">
                    <div class="shortinfo">
                        <p v-show="isNotNull(cur.score)">评分：<span>{{cur.score}}</span></p>
                        <p v-show="isNotNull(cur.year)">年代：{{cur.year}}</p>
                        <p v-show="isNotNull(cur.cate)">类型：{{cur.cate}}</p>
                        <p v-show="isNotNull(cur.director)">导演：{{cur.director}}</p>
                        <p v-show="isNotNull(cur.starring)" class="text_s">主演：{{cur.starring}}</p>
                    </div>
                    <div class="playstate playstate_unplay">
                        <a href="#" class="btn" @click.prevent="play(cur.playlist2.list[0])"><i class="icon-play"></i>在电视上播放</a>
                    </div>
                </div>
            </div>
            <!-- 描述 -->
            <div class="desc">
                <div class="desc-cont" :class="{
                    'text-cut': isDescOverflow,
                    'text-show': isDescShow
                }">
                    <div class="desc-cont-p" v-html="toHTML(cur.desc)"></div>
                </div>
                <a href="#" class="desc-toggle"
                    @click.prevent="isDescShow=!isDescShow"
                    v-show="isDescOverflow"
                    :class="{'open':isDescShow}">
                    <i></i>
                </a>
            </div>
        </div>

        <div class="detail-playlist">
            <div class="hd" v-if="cur.playlist2.list.length">
                {{channelId==='001' ? '正片' : getUpdateSet()}}
                <a href="#" class="showAll" @click.prevent="showAll" v-show="!isShowAll && (channelId==='002' || channelId==='003')">全部<i></i></a>
            </div>
            <ul class="bd" v-if="channelId==='001' || channelId==='004'">
                <li class="item-haspic"
                    v-for="item in cur.playlist2.list"
                    :key="item.index"
                    @click="play(item)">
                    <img v-lazy="item.pictureUrl">
                    <p>{{item.name}}</p>
                    <!--<span class="play" v-show="item.playstate===2"><i></i>当前播放</span>-->
                    <span class="tag_pay" v-show="item.drm && item.drm!='0'"></span>
                </li>
            </ul>
            <ul class="bd" :class="[isShowAll?'bd-num-all':'bd-num']" v-else>
                <li class="item-num"
                    v-for="(item, num) in cur.playlist2.list"
                    :key="item.index"
                    @click="play(item)">{{item.index=='0' ? num+1 : item.index}}
                    <!-- <span class="tag_new" v-show="item.states"></span> -->
                    <span class="tag_pay" v-show="item.drm && item.drm!='0'"></span>
                </li>
            </ul>
            <div class="hd" style="clear:both" v-if="cur.playlist2.list2.length">相关视频</div>
            <ul class="bd">
                <li class="item-haspic"
                    v-for="item in cur.playlist2.list2"
                    :key="item.index"
                    @click="play(item)">
                    <img v-lazy="item.pictureUrl">
                    <p>{{item.name}}</p>
                    <!--<span class="play" v-show="item.playstate===2"><i></i>当前播放</span>-->
                    <span class="tag_pay" v-show="item.drm && item.drm!='0'"></span>
                </li>
            </ul>
        </div>
        </div>
    </div>
<!-- </transition> -->
</template>

<style lang="less">
    // .hidescroll{
    //     overflow: visible !important;
    //     width: auto;
    // }
    // .hidescroll body{
    //     overflow: hidden !important;
    // }
    .slideup-enter-active {
        transition: all .3s ease;
    }
    .slideup-leave-active {
        transition: all .3s ease;
    }
    .slideup-enter, .slideup-leave-to
    /* .slideup-leave-active for <2.1.8 */ {
        transform: translate3d(0,100%,0);
        opacity: 0
    }
    .page-detail{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        z-index: 9;
        color:#75787a;
        background:#fafafa;
        display: flex;
        flex-direction: column;
        // padding-top: 124px;
    }
    .detail-hd{
        height: 124px;
        width: 100%;
        background: #fafafa;
        flex-shrink: 0;
        border-bottom:1px solid #dbdbdb;
        // position: fixed;
        // top: 0;
        // left: 0;
        // z-index: 9;
        .isvip{
            background: #f26161;
            width: 60px;
            line-height: 32px;
            border-radius:3px;
            font-size:24px;
            text-align: center;
            color:#fff;
            opacity:0.9;
            display: inline-block;
            vertical-align:4px;
        }
        .back{
            width: 100px;
            height: 124px;
            background-size: 36px 36px;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 0;
            left: 0;
            background-image: url(../assets/icn_topbar_arrowdown_normal.png);
            &:active{
                background-image: url(../assets/icn_topbar_arrowdown_pressed.png);
            }
        }
        .title{
            text-align: center;
            line-height: 124px;
            color:#2f3133;
            font-size: 36px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 75%;
            margin: 0 auto;
        }
    }
    .detail-bd{
        height: 100%;
        padding-top: 32px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .detail-info{
        margin: 0 32px;
        .info-inner{
            position: relative;
            overflow: hidden;
            margin-bottom: 32px;
        }
        .pic{
            width: 320px;
            height: 470px;
            float: left;
            img{
                width: 100%;
                height: 100%;
                background-color: #525456;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 120px 120px;
                opacity: .5;
                &.pic-001{
                  background-image: url(../assets/icn_TV_movie_white@2x.png)
                }
                &.pic-002{
                  background-image: url(../assets/icn_TV_tvshow_white@2x.png)
                }
                &.pic-003{
                  background-image: url(../assets/icn_TV_comic_white@2x.png)
                }
                &.pic-004{
                  background-image: url(../assets/icn_TV_entertainment_white@2x.png)
                }
            }
            [lazy="loaded"]{
                opacity: 1;
            }
        }
        .text{
            margin-left: 344px;
            height: 470px;
            position: relative;
        }
        .desc{
            clear: both;
            padding-top: 24px;
            border-top: 1px solid #dbdbdb;;
            color:#c8cacc;
            position: relative;
        }
        .desc-cont{
            overflow: hidden;
            height: 126px;
            line-height: 1.4;
        }
        .text-cut{
            height: auto;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .text-show{
            display: block;
        }
        .desc-toggle{
            margin: 0 auto;
            width: 24px;
            display: block;
            color: #fff;
            i{
                display: inline-block;
                background: url(../assets/icn_arrow_up.png) no-repeat center center;
                width: 40px;
                height: 40px;
                background-size: 32px 16px;
                transform: rotate(180deg);
                /*transition: transform .6s;*/
            }
            &.open{
                i{
                    transform:rotate(0deg);
                }
            }
        }
    }
    .shortinfo{
        margin-bottom: 48px;
        p{
            line-height: 54px;
        }
        span{
            color: #ffd53d;
        }
        .text_s{
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }
    .playstate{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 84px;
        .btn{
            background:#13d5dc;
            border-radius:6px;
            height:84px;
            line-height: 84px;
            display: block;
            color: #fff;
            font-size: 36px;
            text-align: center;
            i{
                display: inline-block;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                margin-right: 12px;
                margin-top: -2px;
                vertical-align: middle;
            }
            .icon-play{
                width: 36px;
                height: 36px;
                background-image: url(../assets/icn_play_white_s.png);
            }
            .icon-time{
                width: 34px;
                height: 34px;
                background-image: url(../assets/icn_history_white_s.png);
            }
            .icon-playing{
                width: 36px;
                height: 36px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 12px;
                background: url(../assets/icn_playing_blue_s.png) no-repeat;
                background-size: 100% 100%;
            }
        }
        .btn-outline{
            color: #13d5dc;
            background: none;
            padding-left: 0;
        }
        .tip{
            height: 54px;
            border-radius: 6px;
            position: absolute;
            margin-left: 50px;
            margin-top: 15px;
            padding: 0 27px;
            line-height: 54px;
            background: rgba(255,255,255,.1);
            .arrow{
                position: absolute;
                left:-15px;
                top: 18px;
                width: 0;
                height: 0;
                border-top: 10px solid transparent;
                border-right: 15px solid rgba(255,255,255,.1);
                border-bottom: 10px solid transparent;
            }
        }
    }

    .detail-playlist{
         margin-left:32px;
         border-top: 1px solid #dbdbdb;
         padding-top: 30px;
        .hd{
            margin-bottom: 30px;
            color:#2f3133;
            font-size: 32px;
        }
        .showAll{
            float: right;
            margin-right: 32px;
            color:#75787a;
            i{
                display: inline-block;
                background: url(../assets/icn_arrow_up.png) no-repeat center center;
                width: 24px;
                height: 24px;
                background-size: 24px 12px;
                margin-left: 2px;
                transform:rotate(90deg);
            }
        }
        .bd-num{
            overflow-x: auto;
            display: -webkit-box;
            margin-bottom: 30px;
            &::-webkit-scrollbar {
                display: none;
            }
            li{
                margin-right:16px;
            }
        }
        .bd-num-all{
            display: flex;
            flex-wrap: wrap;
            li{
                margin:0 30px 30px 0;
            }
        }
        li.item-num{
            width: 112px;
            height: 112px;
            line-height: 112px;
            text-align: center;
            position: relative;
            background: #fff;
            border: 1px solid #dbdbdb;
            border-radius: 8px;
            &:active{
                background: #ebebeb;
            }
            &.active{
                background: #19c9cf url(../assets/icn_playing_white_s.png) no-repeat center center;
                background-size: 36px 36px;
                text-indent: -9999px;
            }
        }
        li.item-haspic{
            position: relative;
            width: 320px;
            height: 306px;
            margin:0 25px 0 5px;
            float:left;
            overflow: hidden;
            img{
                width: 320px;
                height: 180px;
                display: block;
                margin-bottom: 18px;
            }
            p{
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .play{
                position: absolute;
                left: 42px;
                top: 54px;
                opacity:0.9;
                background:#13d5dc;
                border-radius:360px;
                width:216px;
                height:60px;
                text-align: center;
                line-height: 60px;
                i{
                    width: 36px;
                    height: 36px;
                    background: url(../assets/icn_playing_white_s.png) no-repeat;
                    background-size: 100% 100%;
                    display: inline-block;
                    vertical-align: middle;
                    margin-top: -4px;
                }
            }
        }
        .tag_new{
            width: 72px;
            height: 72px;
            background: url(../assets/tag_TV_new@2x.png) no-repeat;
            background-size: 100%;
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    .isIOS .detail-hd{
        height: 96px;
        .back{
            height: 96px;
        }
        .title{
            line-height: 96px;
        }
    }
</style>

<script>
    import { mapState, mapActions } from 'vuex'
    import * as service from '../service'

    //隐藏body滚动条
    function toggleBoayScroll(val){
        document.documentElement.className = val ? 'hidescroll' : ''
    }

    export default {
        // props: ['channelId','vid'],
        data() {
            return {
                //是否显示
                // visible: false,
                cur: {
                    playlist: [{
                        list: []
                    }],
                    playlist2: {
                        list: [],
                        list2: []
                    }
                },
                //描述是否超出行数
                isDescOverflow: false,
                //描述展开按钮状态
                isDescShow: false,
                loading: false,
                history: false,
                isShowAll: false
            }
        },
        computed: {
            ...mapState({
                visible: state => state.detailVisible,
                channelId: state => state.activeDetail.channelId,
                vid: state => state.activeDetail.vid,
                ispay: state => state.activeDetail.ispay
            }),
        },
        watch: {
            visible(val) {
                if(val){
                    this.getData()
                }else{
                    this.cur = {
                        playlist: [{
                            list: []
                        }],
                        playlist2: {
                            list: [],
                            list2: []
                        }
                    }
                    this.history = false
                }
                toggleBoayScroll(val)
            },
            loading(val){
                if(val){
                    HdSmart.UI.showLoading()
                }else{
                    HdSmart.UI.hideLoading()
                }
            }
        },
        methods: {
            ...mapActions([
                'hideDetail'
            ]),
            getData() {
                this.loading = true
                service.getDetaileData({
                    channelId: this.channelId,
                    vid: this.vid
                },(err, data) => {
                    this.loading = false
                    if(err){
                        this.close()
                        return
                    }

                    var temp = data.data
                    var playlist = temp.playlist[0]
                    temp.playlist2 = {}
                    temp.playlist2.total = playlist.total
                    temp.playlist2.list = playlist.list.filter(item=>item.states=='1')
                    temp.playlist2.list2 = playlist.list.filter(item=>item.states!='1')
                    this.cur = Object.freeze(temp)
                    this.setHistory()
                })
            },
            //点播：播放状态如playstate
            play(clickItem) {
                if(!clickItem){
                    clickItem = this.cur.playlist2.list[0] || this.cur.playlist2.list2[0]
                }
                if(clickItem){
                    service.playVideo(clickItem.link,clickItem.name)
                }
            },
            //描述按行截取：对比实际文本高度和3行文本高度，如果超出则截断，显示展开按钮
            getDescLine() {
                if(this.$el){
                    this.isDescShow = false
                    this.isDescOverflow = false
                    this.$nextTick(()=>{
                        let wrapHeight = this.$el.querySelector('.desc-cont').offsetHeight
                        let textHeight = this.$el.querySelector('.desc-cont-p').offsetHeight

                        if(textHeight > wrapHeight){
                            this.isDescOverflow = true
                        }else{
                            this.isDescOverflow = false
                        }
                    })
                }
            },
            getUpdateSet() {
                var count = this.cur.playlist2.total + 1//-this.cur.playlist2.list2.length
                var last = this.cur.playlist2.list.length
                if(!count || !last || count == '0' || last == '0'){
                    return ''
                }else if(last === count){
                    return count + '集全'
                }else{
                    return '更新至' + last + '集'
                }
            },
            close() {
                if(this.visible){
                    if(this.history){
                        this.$router.go(-1)
                    }
                    this.hideDetail()
                }
            },
            toHTML(str) {
                if(!str) return ''
                return str.split('\n').map(item=>{
                    return '\u3000\u3000' + item
                }).join('<br>')
            },
            isNotNull(str) {
                return str && str != 'null'
            },
            setHistory() {
                this.history = true
                var query = {
                    ...this.$route.query,
                    detail: this.channelId + '_' + this.vid
                }
                this.$router.push({query})
            },
            showAll() {
                this.isShowAll = true
            }
        },
        created() {
            this.$watch('cur.desc',this.getDescLine)
            //详情页添加history change
            this.$watch('$route.query.detail',(newVal, oldVal)=>{
                if(oldVal && newVal === undefined && this.visible){
                    this.hideDetail()
                }
            })
        }
    }
</script>

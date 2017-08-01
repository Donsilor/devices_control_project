<!--
    详情页
-->
<template>
<!-- <transition name="slideup"> -->
    <div class="page-detail" v-show="visible">
        <div class="detail-hd">
            <span class="back" @click="close"></span>
            <div class="title">{{cur.title}}</div>
        </div>
        <div class="detail-info clearfix">
            <div class="pic">
                <img v-lazy="cur.pictureUrl">
            </div>
            <div class="text">
                <div class="shortinfo">
                    <p>评分：<span>{{cur.score}}</span></p>
                    <p>年代：{{cur.year}}</p>
                    <p>类型：{{cur.cate}}</p>
                    <p>导演：{{cur.director}}</p>
                    <p>主演：{{cur.starring}}</p>
                </div>
                <!-- 未播放 -->
                <div class="playstate playstate_unplay" v-show="playstate===0">
                    <a href="#" class="btn" @click.prevent="play(cur.playlist[0].list[0])"><i class="icon-play"></i>在电视上播放</a>
                </div>
                <div class="playstate playstate_play" v-show="playstate===1">
                    <a href="javascript:void(0)" class="btn btn-outline">正在投屏...</a>
                </div>
                <!-- 正在播放 -->
                <div class="playstate playstate_play" v-show="playstate===2">
                    <a href="javascript:void(0)" class="btn btn-outline"><i class="icon-playing"></i>正在电视上播放</a>
                </div>
                <!-- 继续播放 -->
                <!--
                <div class="playstate playstate_conplay" v-show="false">
                    <a href="#" class="btn"><i class="icon-time"></i>继续播放</a>
                    <span class="tip"><i class="arrow"></i>上次观看到第22集</span>
                </div>
                -->

                <!-- 描述 -->
                <div class="desc">
                    <div class="desc-cont" :class="{
                        'text-cut': isDescOverflow,
                        'text-show': isDescShow
                    }"><p>{{cur.desc}}</p>    
                    </div>
                    <a href="#" class="desc-toggle" 
                        @click.prevent="isDescShow=!isDescShow" 
                        v-show="isDescOverflow"
                        :class="{'open':isDescShow}">
                        {{isDescShow?'收起':'展开'}}<i></i>
                    </a>
                </div>
                
            </div>
        </div>
        
        <div class="detail-playlist" v-show="cur.playlist[0].total > 1">
            <div class="hd">
                {{getUpdateSet(cur.playlist[0].total,cur.playlist[0].list.length)}}
            </div>
            <ul class="bd" v-if="channelId==='004'">
                <li class="item-haspic"
                    v-for="item in cur.playlist[0].list" 
                    :key="item.index"
                    @click="play(item)">
                    <img :src="item.pictureUrl">
                    <p>{{item.name}}</p>
                    <span class="play" v-show="item.playstate===2"><i></i>当前播放</span>
                </li>
            </ul>
            <ul class="bd" v-else>
                <li class="item-num" 
                    v-for="item in cur.playlist[0].list" 
                    :key="item.index"
                    :class="{'active':item.playstate===2}"
                    @click="play(item)">
                    {{item.index}}
                    <!-- <span class="tag_new" v-show="item.states"></span> -->
                </li>
            </ul>
        </div>
    </div>
<!-- </transition> -->
</template>

<style lang="less">
    .hidescroll,.hidescroll body{
        overflow: hidden;
    }
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
        overflow-y: auto;
        z-index: 9;
        color: #fff;
        background-color: rgba(0,0,0,0.9);
        &.show{ 
            display: block;
        }
    }
    .page-detail:before{    

    }
    .detail-hd{
        height: 156px;
        position: relative;
        .back{  
            width: 100px;
            height: 96px;
            background-size: 36px 36px;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 0;
            left: 0;
            background-image: url(../assets/icn_topbar_arrowdown_w_normal.png);
            &:active{   
                background-image: url(../assets/icn_topbar_arrowdown_w_pressed.png);
            }
        }
        .title{ 
            text-align: center;
            line-height: 90px;
        }
    }
    .detail-info{
        margin: 0 60px 35px;
        overflow: hidden;
        .pic{   
            width: 450px;
            height: 630px;
            float: left;
            margin-left: 30px;
            img{
                width: 100%;
                height: 100%;
                background: url(../assets/icn_tv_movie.png) no-repeat center center;
                background-size: 120px 120px;
                opacity: .3;
                border:1px solid #fff;
                box-sizing: border-box;
            }
            [lazy="loaded"]{   
                opacity: 1;
                border: 0;
            }
        }
        .text{  
            margin-left: 516px;
        }
        .desc{  
            padding-top: 36px;
            border-top: 1px solid rgba(255,255,255,0.3);
            color: rgba(255,255,255,.5);
            position: relative;
        }
        .desc-cont{ 
            overflow: hidden;
            height: 117px;
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
            float: right;
            color: #fff;
            i{  
                display: inline-block;
                background: url(../assets/icn_arrow_down.png) no-repeat center center;
                width: 24px;
                height: 24px;
                background-size: 24px 12px;
                margin-left: 2px;
                transform:rotate(0deg);
                transition: transform .6s;
            }
            &.open{ 
                i{  
                    transform:rotate(180deg);
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
    }
    .playstate{ 
        height: 84px;
        margin-bottom: 48px;
        .btn{   
            background:#13d5dc;
            border-radius:6px;
            height:84px;
            line-height: 84px;
            padding: 0 36px;
            display: inline-block;
            color: #fff;
            font-size: 36px;
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
         margin: 0 60px;
         border-top: 1px solid #6e6f6f; 
         padding-top: 30px;
        .hd{    
            margin-bottom: 30px;
        }
        .bd{ 
            margin-left: 30px;
            li.item-num{ 
                width: 120px;
                height: 120px;
                line-height: 120px;
                text-align: center;
                float: left;
                position: relative;
                background: #5b5b5b;
                border-radius: 5px;
                margin-right: 24px;
                margin-bottom: 24px;
                &.active{   
                    background: #19c9cf url(../assets/icn_playing_white_s.png) no-repeat center center;
                    background-size: 36px 36px;
                    text-indent: -9999px;
                }
            }
            li.item-haspic{    
                position: relative;
                width: 300px;
                height: 306px;
                margin-right: 60px;
                float:left;
                img{
                    width: 300px;
                    height: 168px;
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
                background: url(../assets/tag_tv_new.png) no-repeat;
                background-size: 100%;
                position: absolute;
                right: 0;
                top: 0;
            }
        }
    }
</style>

<script>

    import * as service from '../service'

    //隐藏body滚动条
    function toggleBoayScroll(val){  
        //document.documentElement.className = val ? 'hidescroll' : ''
    }

    export default {
        props: ['channelId','vid'],
        data() {    
            return {
                //是否显示
                visible: false,
                cur: {  
                    playlist: [{    
                        list: []
                    }]
                },
                //描述是否超出行数
                isDescOverflow: false,
                //描述展开按钮状态
                isDescShow: false,
                loading: false
            }
        },
        watch: {    
            visible(val) {
                if(val){   
                    this.getData()
                    this.$emit('onShow')
                }else{
                    this.cur = {
                        playlist: [{    
                            list: []
                        }]
                    }
                    this.$emit('onClose')
                }
            },
            loading(val){   
                if(val){ 
                    HdSmart.UI.showLoading()
                }else{    
                    HdSmart.UI.hideLoading()
                }
            }
        },
        computed: { 
            //当前播放集数
            activeItem() {
                return this.cur.playlist[0].list.find(item=>item.playstate)
            },
            //播放状态：0不播放，1投屏中，2正在播放
            playstate() { 
                return this.activeItem ? this.activeItem.playstate : 0
            }
        },
        methods: {   
            getData() {
                this.loading = true
                service.getDetaileData({    
                    channelId: this.channelId,
                    vid: this.vid
                },(data) => {   
                    this.loading = false
                    //错误返回
                    if(data.code === 504){
                        return 
                    }
                    if(data.errorcode !== 0){   
                        HdSmart.UI.toast(data.errormsg)
                        return 
                    }
                    this.cur = data.data
                })
            },
            //点播：播放状态如playstate
            play(clickItem) {
                //如果'点击'正在播放，返回
                if(clickItem.playstate){
                    return 
                }
                //取消当前播放状态
                if(this.activeItem){    
                    this.$set(this.activeItem,'playstate',0)
                }
                //设置'点击'状态为loading
                this.$set(clickItem,'playstate',1)
                //发起点播
                service.playVideo(clickItem.link,clickItem.name,(data)=>{  
                    if(data.code === 504){ 
                        //点播失败
                        this.$set(clickItem,'playstate',0)
                        HdSmart.UI.toast('投屏失败，请重试')
                    }else{ 
                        //点播成功
                        this.$set(clickItem,'playstate',2)
                    }
                }) 
            },
            //描述按行截取：对比实际文本高度和3行文本高度，如果超出则截断，显示展开按钮
            getDescLine() {
                if(this.$el){
                    this.isDescShow = false
                    this.isDescOverflow = false
                    this.$nextTick(()=>{
                        let wrapHeight = this.$el.querySelector('.desc-cont').offsetHeight
                        let textHeight = this.$el.querySelector('.desc-cont p').offsetHeight

                        if(textHeight > wrapHeight){    
                            this.isDescOverflow = true
                        }else{  
                            this.isDescOverflow = false
                        }
                    })
                }
            },
            getUpdateSet(count, last) {
                if(last == ''){   
                    return ''
                }else if(last === count){   
                    return count + '集全'
                }else{  
                    return '更新至' + last + '集'
                }
            },
            close() {   
                this.visible = false
            }
        }, 
        created() { 
            this.$watch('cur.desc',this.getDescLine)
        }
    }
</script>
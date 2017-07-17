<template>
    <div class="page-detail" :class="{show:visible}">
        <div class="detail-hd">
            <a href="#" class="back" @click.prevent="visible=false"></a>
            <div class="title">{{cur.title}}</div>
        </div>
        <div class="detail-info clearfix">
            <div class="pic">
                <img :src="cur.pictureUrl">
            </div>
            <div class="text">
                <div class="shortinfo">
                    <p>年代：{{cur.year}}</p>
                    <p>类型：{{cur.cate}}</p>
                    <p>导演：{{cur.director}}</p>
                    <p>主演：{{cur.starring}}</p>
                </div>
                <!-- 未播放 -->
                <div class="playstate playstate_unplay" v-show="true">
                    <a href="" class="btn"><i class="icon-play"></i>在电视上播放</a>
                </div>
                <!-- 正在播放 -->
                <div class="playstate playstate_play" v-show="false">
                    <a href="" class="btn btn-outline"><i class="icon-playing"></i>正在电视上播放</a>
                </div>
                <!-- 继续播放 -->
                <div class="playstate playstate_conplay" v-show="false">
                    <a href="#" class="btn"><i class="icon-time"></i>继续播放</a>
                    <span class="tip"><i class="arrow"></i>上次观看到第22集</span>
                </div>

                <!-- 描述 -->
                <div class="desc">
                    <div class="desc-cont" v-bind:class="{
                        'text-cut': isDescOverflow,
                        'text-show': isDescShow
                    }"><p>{{cur.desc}}</p>    
                    </div>
                    <a href="#" class="desc-toggle" 
                        @click.prevent="isDescShow=!isDescShow" 
                        v-show="isDescOverflow"
                        v-bind:class="{'open':isDescShow}">
                        {{isDescShow?'收起':'展开'}}<i></i>
                    </a>
                </div>
                
            </div>
        </div>
        <div class="line"></div>
        <div class="detail-playlist" v-show="cur.playlist[0].total > 1">
            <div class="hd">{{cur.playlist[0].total}}</div>
            <ul class="bd">
                <li class="active" v-for="item in cur.playlist[0].list" @click="play(item.link)">
                    {{item.index}}
                    <span class="tag_new" v-show="item.states"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="less">
    .hidescroll,.hidescroll body{
        overflow: hidden;
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
        display: none;
        &.show{ 
            display: block;
        }
    }
    .page-detail:before{    
        /*毛玻璃效果，不管用 - -
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        filter: blur(20px);
        z-index: -1;
        */
    }
    .detail-hd{
        height: 156px;
        position: relative;
        .back{  
            width: 36px;
            height: 36px;
            background-size: 100% 100%;
            background-repeat: norepeat;
            position: absolute;
            top: 32px;
            left: 224px;
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
            padding: 0 27px;
            line-height: 54px;
            background: #000;
            .arrow{ 
                position: absolute;
                left:0;
                top: 50%;
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
            li{ 
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
                visible: false,
                cur: {  
                    playlist: [{    
                        list: []
                    }]
                },
                isDescOverflow: false,
                isDescShow: false
            }
        },
        watch: {    
            visible(val) {
                if(val){   
                    this.getData()
                }
            }
        },
        methods: {   
            getData() {
                service.getDetaileData({    
                    channelId: this.channelId,
                    vid: this.vid
                },(data) => {   
                    this.cur = data.data
                    console.log(data.data)
                })
            },
            play(link) {    
                console.log(link)   
            },
            //对比实际文本高度和3行文本高度，如果超出则截断，显示展开按钮
            getDescLine() {
                if(this.$el){
                    this.isDescShow = false
                    this.isDescOverflow = false
                    this.$nextTick(()=>{
                        let wrapHeight = this.$el.querySelectorAll('.desc-cont')[0].offsetHeight
                        let textHeight = this.$el.querySelectorAll('.desc-cont p')[0].offsetHeight
                        console.log(wrapHeight,textHeight)
                        if(textHeight > wrapHeight){    
                            this.isDescOverflow = true
                        }else{  
                            this.isDescOverflow = false
                        }
                    })
                }
            }
        }, 
        created() { 
            this.$watch('cur.desc',this.getDescLine)
        },
        mounted() {
            if(this.visible){
                this.getData()
            }
        }
    }
</script>
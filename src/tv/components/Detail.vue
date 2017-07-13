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

                <div class="desc">
                    <div class="desc-cont" v-substrline="cur.desc"></div>

                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="detail-playlist">
            <div class="hd">52集全</div>
            <ul class="bd">
                <li class="active">
                    1
                    <span class="tag_new"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
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
        background: rgba(0,0,0,.8);
        color: #fff;
        display: none;
        &.show{ 
            display: block;
        }
    }
    .detail-hd{
        height: 156px;
        .back{  
            width: 36px;
            height: 36px;
            background-size: 100% 100%;
            background-repeat: norepeat;
            float: left;
            margin-top: 32px;
            margin-left: 224px;
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
        }
        .desc-cont{ 
            overflow: hidden;
            height: 78px;
        }
        .text-hide{ 
            height: auto;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .text-show{ 
            display: block;
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
                desc_open: false, 
                cur: {}
            }
        },
        watch: {    
            visible(val) { 
                toggleBoayScroll(val)
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
                })
            }
        },  
        directives: { 
            substrline: {   
                inserted(el,binding) {},
                update(el,binding) {
                    if(binding.oldValue !== binding.value){
                        el.innerHTML = '<p>' + binding.value + '</p>'
                        var wrapHeight = el.offsetHeight
                        var textHeight = el.getElementsByTagName('p')[0].offsetHeight
                        console.log(textHeight,wrapHeight)
                        if(textHeight > wrapHeight){    
                            el.classList.add('text-hide')
                        }else{  
                            el.classList.remove('text-hide')
                        }
                    }
                }
            }
        },
        mounted() {
            toggleBoayScroll(this.visible)
            if(this.visible){
                this.getData()
            }
        }
    }
</script>
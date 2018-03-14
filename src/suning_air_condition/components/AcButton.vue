<template>
    <div :class="classObj">
        <div class="imgWrapper"  @click="tap">
            <img v-if="info.imgSrc" :src="info.imgSrc" class="img-normal" /><!--v-show="!classObj.active"-->
            <img v-if="info.imgActiveSrc" :src="info.imgActiveSrc" class="img-active" /><!--v-show="classObj.active"-->
        </div>
        <span class="btnName" v-if="info.title">{{info.title}}</span>
    </div>
</template>

<style scoped>
    .button{
        text-align: center;
        display: inline-block;
    }
    .imgWrapper{
        border-radius: 100%;
        text-align: center;
        cursor: pointer;
        border: none 0;
        outline: none 0;
        /*margin-bottom: 10px;*/
        /*解决点击出现背景*/
        -webkit-tap-highlight-color: transparent;
    }

    .imgWrapper img{
        vertical-align: middle;
    }

    .temperature .imgWrapper img{
        margin-top: 0;
    }

    .img-normal{
        display: inline-block;
    }
    .img-active{
        display: none;
    }
    .active .img-normal{
        display: none;
    }
    .active .img-active{
        display: inline-block;
    }
</style>

<script>
    export default {
        data: function () {
            return{
                processing: false,
                processingTimer: null
            }
        },
        /**
         * info属性说明
         * title: 按钮title，底部文字
         * type: 控制的属性类型
         * value: 控制的属性值
         * imgSrc: 正常状态图片src
         * imgActiveSrc: 激活状态图片src
         * tip: 控制成功提示文字
         * continuousClick: 是否允许连续点击
         * */
        props: [ 'info', 'curValue'],
        computed:{
            classObj(){
                var obj = {
                    'button': true,
                    'active': this.info.value === 'on' || (this.info.value === this.curValue),
                    'disabled': this.info.disabled
                };
                obj[this.info.type] = true;
                return obj;
            }
        },
        methods:{
            tap(){
                if(this.info.disabled){
                    return
                }
                //不允许连续点击，添加timer及tag判断
                if(!this.info.continuousClick){
                    if(this.processing){
                        return;
                    }

                    this.processing = true;
                    clearTimeout(this.processingTimer);
                    this.processingTimer = setTimeout( ()=> {
                        this.processing = false;
                    }, 300);
                }

                this.$emit('tap', this.info.type, this.info.value, this.info.tip, this.$el);
            }
        }
    }
</script>

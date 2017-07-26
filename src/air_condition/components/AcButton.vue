<template>
    <div :class="classObj">
        <div class="imgWrapper"  v-finger:tap="tap">
            <img v-if="info.imgSrc" v-show="!classObj.active" :src="info.imgSrc" />
            <img v-if="info.imgActiveSrc" v-show="classObj.active" :src="info.imgActiveSrc" />
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
        margin-bottom: 10px;
        /*解决点击出现背景*/
        -webkit-tap-highlight-color: transparent;
    }

    .imgWrapper img{
        vertical-align: middle;
    }

    .temperature .imgWrapper img{
        margin-top: 0;
    }
</style>

<script>
    import Vue from 'vue';
    import AlloyFinger from 'alloyfinger';
    import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';
    Vue.use(AlloyFingerVue, { AlloyFinger });

    export default {
        data: function () {
            return{
                processing: false
            }
        },
        props: [ 'info', 'curValue'],
        computed:{
            classObj(){
                var obj = {
                    'button': true,
//                    'active': this.info.value === this.curValue
                    'active': this.info.value === 'on' || (this.info.value === this.curValue),
                    'disabled': this.info.disabled
                };
                obj[this.info.type] = true;
                return obj;
            }
        },
        methods:{
            tap(){
                //TODO:温度特殊处理，需优化
                if(this.info.type != 'temperature'){
                    if(this.processing){
                        return;
                    }
                    this.processing = true;
                    setTimeout(()=> {
                        this.processing = false;
                    }, 500);
                }

                this.$el.classList.add('pressed');
                this.$emit('tap', this.info.type, this.info.value, this.info.tip, this.$el);
//                if(this.curValue !== this.info.value){
//                    this.$emit('click', this.info.type, this.info.value);
//                }
            }
        }
    }
</script>

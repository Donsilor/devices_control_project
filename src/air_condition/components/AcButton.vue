<template>
    <div :class="classObj">
        <div class="imgWrapper" @click="click">
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
    }
    .imgWrapper{
        transition: background-color 0.5s linear;
    }
    .imgWrapper img{
        vertical-align: middle;
        /*margin-top: 9px;*/
    }

    /*温度*/
    /*.temperature .imgWrapper{*/
        /*width: 144px;*/
        /*height: 144px;*/
    /*}*/
    .temperature .imgWrapper img{
        /*width: 144px;*/
        /*height: 144px;*/
        margin-top: 0;
    }
</style>

<script>
    export default {
        props: [ 'info', 'curValue'],
        computed:{
            classObj(){
                var obj = {
                    'button': true,
//                    'active': this.info.value === this.curValue
                    'active': this.info.value === 'on' || (this.info.value === this.curValue)
                };
                obj[this.info.type] = true;
                return obj;
            }
        },
        methods:{
            click(){
                this.$emit('click', this.info.type, this.info.value, this.info.tip);
//                if(this.curValue !== this.info.value){
//                    this.$emit('click', this.info.type, this.info.value);
//                }
            }
        }
    }
</script>

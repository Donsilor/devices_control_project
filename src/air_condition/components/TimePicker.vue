<template>
    <section @click.stop="" v-show="visible" class="select-panel">
        <header>{{title}}</header>
        <main>
            <div class="left" v-finger:swipe="swipeH">
            <!--<div class="left">-->
                <ul class="hour" ref="ulHour">
                    <li v-for="h in hourList" :class="{ selected: h === curHour }">{{ h }}</li>
                </ul>
            </div>
            <div class="unit">时</div>
            <div class="right" v-finger:swipe="swipeM">
            <!--<div class="right">-->
                <ul class="minute" ref="ulMinute">
                    <li v-for="m in minuteList" :class="{ selected: m === curMinute }">{{ m }}</li>
                </ul>
            </div>
            <div class="unit">分</div>
        </main>
        <footer>
            <button type="button" class="button button-cancel" @click="cancel(false)">取消</button>
            <button type="button" class="button button-confirm" @click="setTime">确定</button>
        </footer>
    </section>
</template>

<style scoped>
    .select-panel{
        font-size: 30px;
        background: #fff;
        border-radius: 6px;
        width: 600px;
        height: 582px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .button{
        font-size: 36px;
        background: #ffffff;
        border:1px solid #75787a;
        border-radius:6px;
        width: 238px;
        height: 82px;
        cursor: pointer;
        outline: none;
    }
    header{
        box-shadow: inset 0 -1px 0 0 #dbdbdb;
        line-height: 84px;
        min-height: 84px;
        color: #75787a;
    }

    main{
        padding: 47px 0 60px 0;
        color: #c8cacc;
    }
    .left, .right{
        display: inline-block;
        height: 270px;
        line-height: 90px;
        /*overflow: scroll;*/
        overflow: hidden;
        width: 180px;
    }
    .hour, .minute{
        list-style: none;
        /*overflow: scroll;*/
        height: 270px;
    }
    .hour li, .minute li{
        border-bottom: 1px solid #dbdbdb;
    }
    li.selected{
        color: #46bcff;
    }
    .unit{
        display: inline-block;
        line-height: 270px;
        vertical-align: top;
        color: #75787a;
    }

    footer{
        position: absolute;
        bottom: 37px;
        left: 0;
        right: 0;
        text-align: center;
    }
</style>

<script>
    import Vue from 'vue';
    import AlloyFinger from 'alloyfinger';
    import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue';
    Vue.use(AlloyFingerVue, { AlloyFinger });

    export default{
        name: 'time-picker',
        props:
            {
                visible: Boolean,
                hour: String,
                minute: String,
                title: String
            },
        data(){
            return{
                hourList: [],
                minuteList: [],
                liHeight: 0,
                curHour: '',
                curMinute: ''
            }
        },
        computed: {
            translateH(){
                return  (1 - parseInt(this.curHour)) * this.liHeight;
            },
            translateM(){
                return  (1 - parseInt(this.curMinute)) * this.liHeight;
            }
//            scrollH(){
//                return  (1 - parseInt(this.curHour)) * this.liHeight;
//            },
//            scrollM(){
//                return  (1 - parseInt(this.curMinute)) * this.liHeight;
//            }
        },
        watch: {
            hour(val){
//                if(!this.curHour){
//                    this.curHour = val;
//                }
                this.curHour = val;
            },
            minute(val){
//                if(!this.curMinute){
//                    this.curMinute = val;
//                }
                this.curMinute = val;
            }
        },
        mounted: function () {
            this.hourList = this.generateArray(0, 23, 2);
            this.minuteList = this.generateArray(0, 59, 2);
//            console.log(this.hour + '--' + this.minute);
        },
        updated: function () {
//            this.liHeight = this.$refs.ulHour.childNodes[0].offsetHeight;
            this.liHeight = 61;
            this.setTranslateH();
            this.setTranslateM();

            if(!this.curHour){
                this.curHour = this.hour;
            }
            if(!this.curMinute){
                this.curMinute = this.minute;
            }
//            console.log(this.hour + '--' + this.minute);
        },
        methods:{
            generateArray: function (start, end, strLength) {
                let arr = [];

                for(let i = start; i < end + 1; i++){
                    let s = i.toString();
                    if(s.length < strLength){
                        arr.push('0'.repeat(strLength - s.length) + s);
                    }
                    else{
                        arr.push(s);
                    }
                }

                return arr;
            },
            swipeH: function(evt) {
                var direction = evt.direction.toLowerCase();
                let index = this.hourList.indexOf(this.curHour);
                if (direction === 'up' && (index + 1) < this.hourList.length ){
                    this.curHour = this.hourList[index + 1];
                }
                else if(direction === 'down' && index > 0){
                    this.curHour = this.hourList[index - 1];
                }

                this.setTranslateH();
            },
            swipeM: function(evt) {
                var direction = evt.direction.toLowerCase();
                let index = this.minuteList.indexOf(this.curMinute);
                if (direction === 'up' && (index + 1) < this.minuteList.length){
                    this.curMinute = this.minuteList[index + 1];
                }
                else if(direction === 'down' && index > 0){
                    this.curMinute = this.minuteList[index - 1];
                }

                this.setTranslateM();
            },
            cancel: function (visible) {
                this.curHour = this.hour;
                this.curMinute = this.minute;
                this.$emit('vchange', visible);
            },
            setTranslateH: function () {
                this.setTranslateY(this.$refs.ulHour, this.translateH);
            },
            setTranslateM: function () {
                this.setTranslateY(this.$refs.ulMinute, this.translateM);
            },
            setTime: function () {
                this.$emit('change', this.curHour + ':' + this.curMinute);
            },
            setTranslateY: function (el, offset) {
                el.style.transform = 'translateY('+ offset +'px)';
            }
        }
    }
</script>

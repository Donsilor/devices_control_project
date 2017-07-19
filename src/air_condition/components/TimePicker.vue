<template>
    <section @click.stop="" class="select-panel" :vis="vis"><!--v-show="visible" -->
        <header>{{title}}</header>
        <main>
            <div class="left">
                <ul class="hour" ref="ulHour">
                    <li v-for="h in hourList" :class="{ selected: h === curHour }">{{ h }}</li>
                </ul>
                <hr class="line line-first">
                <hr class="line line-second">
            </div>
            <div class="unit">时</div>
            <div class="right">
                <ul class="minute" ref="ulMinute">
                    <li v-for="m in minuteList" :class="{ selected: m === curMinute }">{{ m }}</li>
                </ul>
                <hr class="line line-first">
                <hr class="line line-second">
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
    .button-confirm {
        background: #46bcff;
        font-size:36px;
        color: #ffffff;
        border-color: #46bcff;
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
        /*overflow: hidden;*/
        overflow-y: hidden;
        width: 180px;
        position: relative;
    }
    .line{
        position: absolute;
        border: none;
        border-top: 1px solid #dbdbdb;
        width: 100%;
    }
    .line-first{
        top: 90px;
    }
    .line-second{
        top: 180px;
    }
    .hour, .minute{
        list-style: none;
        /*overflow-y: scroll;*/
        overflow-x: hidden;
        height: 270px;

    }
    .hour li, .minute li{
        min-height: 90px;
    }
    li.selected{
        color: #46bcff;
    }
    .unit{
        display: inline-block;
        line-height: 270px;
        vertical-align: top;
        color: #75787a;
        padding: 0 10px;
    }
    .unit:last-of-type{
        padding-right: 0;
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
                vis: Boolean,
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
                curMinute: '',
                timeoutH: null,
                timeoutM: null,
            }
        },
        computed: {
            scrollH(){
                return this.liHeight * (this.hourList.indexOf(this.curHour) - 1);
            },
            scrollM(){
                return this.liHeight * (this.minuteList.indexOf(this.curMinute) - 1);
            }
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
            },
            vis(value){
                if(value){
                    if(!this.liHeight){
                        this.liHeight = this.$refs.ulHour.childNodes[0].offsetHeight;
                    }

                    this.$refs.ulHour.scrollTop = this.scrollH;
                    this.oldTopH = this.scrollH;
                    this.$refs.ulMinute.scrollTop = this.scrollM;
                    this.oldTopH = this.scrollM;
                }
            }
        },
        mounted: function () {
            this.hourList = this.generateArray(0, 23, 2);
            this.minuteList = this.generateArray(0, 59, 2);
//            console.log(this.hour + '--' + this.minute);

            let that = this;
            let liHeight = this.liHeight > 0 ? this.liHeight : 60;
            function scrollSelectH() {
                clearTimeout(that.timeoutH);

                that.timeoutH = setTimeout(function () {
                    let index = Math.round(that.$refs.ulHour.scrollTop / liHeight);
                    that.$refs.ulHour.scrollTop = liHeight * index;
                    that.curHour = that.hourList[index + 1];
                }, 100);
            }
            function scrollSelectM() {
                clearTimeout(that.timeoutM);

                that.timeoutM = setTimeout(function () {
                    let index = Math.round(that.$refs.ulMinute.scrollTop / liHeight);
                    that.$refs.ulMinute.scrollTop = liHeight * index;
                    that.curMinute = that.minuteList[index + 1];
                }, 100);
//                let newTop = that.$refs.ulMinute.scrollTop;
//                if(that.oldTopM === newTop){
//                    let t = newTop / liHeight;
//                    if(t !== 0){
//                        let index = Math.round(t);
//                        that.$refs.ulMinute.scrollTop = liHeight * index;
//                        that.oldTopM = liHeight * index;
//                        that.curMinute = that.minuteList[index + 1];
//                    }
//                }
//                else{
//                    that.oldTopM = newTop;
//                    that.timeoutM = setTimeout(scrollSelectM, 0);
//                }
            }

            this.$refs.ulHour.onscroll = scrollSelectH;
            this.$refs.ulMinute.onscroll = scrollSelectM;
        },
        updated: function () {
            if(!this.curHour){
                this.curHour = this.hour;
            }
            if(!this.curMinute){
                this.curMinute = this.minute;
            }
        },
        methods:{
            generateArray: function (start, end, strLength) {
                let arr = [];

                arr.push('');
                for(let i = start; i < end + 1; i++){
                    let s = i.toString();
                    if(s.length < strLength){
                        arr.push('0'.repeat(strLength - s.length) + s);
                    }
                    else{
                        arr.push(s);
                    }
                }
                arr.push('');

                return arr;
            },
            cancel: function (visible) {
                this.curHour = this.hour;
                this.curMinute = this.minute;
                this.$emit('vchange', visible);
            },
            setTime: function () {
                this.$emit('change', this.curHour + ':' + this.curMinute);
            }
//            ,
//            setTranslateY: function (el, offset) {
//                el.style.transform = 'translateY('+ offset +'px)';
//            }
        }
    }
</script>

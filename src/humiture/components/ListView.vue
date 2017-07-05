<template>
    <div class="ct" ref="list_ct" v-show="data_loaded">
        <div ref="list_scroller" :style="{width : 100 * (datalist.length + 1) + 'px'}">
            <ul class="data-list" :style="{width : 100 * (datalist.length + 1) + 'px'}">
                <li v-for="(item, index) in datalist">
                    <time class="i time">{{item.time_stap | _time}}</time>
                    <span class="i temperature">{{item.temp | _temp}}</span>
                    <span class="i humidity">{{item.hum | _hum}}</span>
                </li>
                <li class="curr">
                    <time class="i time">现在</time>
                    <span class="i temperature">{{temp | _temp}}</span>
                    <span class="i humidity">{{hum | _hum}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .ct {
        width: 1680px;
        overflow: hidden;
        white-space: nowrap;
    }

    ul.data-list {
        list-style: none;
        padding: 0;
        width: 100%;
        margin: 0;
    }

    ul.data-list li {
        display: inline-block;
        width: 150px;
        color: #808080;
    }

    ul.data-list li.curr {
        color: #20BCDE;
    }

    ul.data-list li .i {
        font-family: Roboto-Regular;
        font-size: 30px;
        letter-spacing: 0;
        line-height: 30px;
        text-align: center;
        display: block;
    }

    ul.data-list li .time {
        font-size: 24px;
        line-height: 24px;
        /*margin : 24px 48px 42px 48px;*/
        margin: 24px 0 42px 0;
    }

    ul.data-list li .temperature, ul.data-list li .humidity {
        font-size: 30px;
        margin: 24px 0;
    }
</style>

<script>
    import {$time_format, $timeout} from '../utils';

    import IScroll from 'iscroll/build/iscroll-lite';

    let d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth(),
        date = d.getDate(),
        hour = d.getHours(),
        //当前时间往回去的最近一个整点时间
        last_hour = +new Date(year, month, date, hour),
        //当前时间往回去的最近一个自然日的0点时刻。
        last_date = +new Date(year, month, date)

    export default {
        name: 'list-view',
        props: {
            'temp': Number,
            'hum': Number,
            'is_current': Boolean
        },
        data (){
            return {
                datalist: [],
                scroller: null,
                data_loaded: false,
            }
        },
        filters: {
            _time (val){
                if (typeof val === "number") {
                    return (val < last_date ? '昨天 ' : '') + $time_format(val, 'hh:mm');
                } else {
                    return val;
                }
            },
            _temp  (val){
                return val ? ((val / 100).toFixed(1) + '°C') : '-'
            },
            _hum (val){
                return val ? ((val / 100).toFixed(1) + '%') : '-'
            }
        },
//    watch : {
//      is_current (val){
//        //当切换到详情页，如果scroller还没有初始化，立即初始化。
//        val && (!this.scroller) && this.init_scroller();
//      }
//    },
        methods: {
            init_scroller (){
                $timeout(300).then(() => {
                    let wp = this.$refs.list_ct;

                    this.scroller = new IScroll(wp, {
                        scrollX: true,
                        scrollY: false,
                        //TODO:这里需要再看看，为什么差值为1280，而实际上需要1380才对。
                        startX: wp.clientWidth - wp.firstElementChild.clientWidth,
                    });

                });
            }
        },
        mounted (){
            HdSmart.Device.postRequest('getDeviceLogByDay', {
                start_time: last_hour
            }, data => {
                this.data_loaded = true;
                let list = data.log.map((item, i) => {
                    let attr = item.attr;
                    return {
                        time: item.time,
                        hum: attr.humidity,
                        temp: attr.temperature,
                        //基准线，如5点整
                        time_stap: last_hour - i * 3600 * 1000
                    }
                });
                this.datalist = list.reverse();

                this.init_scroller();
//        let wp = this.$refs.list_ct;
//        $timeout(500).then(()=>{
//          console.log('init ---scroller..', wp.clientWidth);
//          this.scroller = new IScroll(wp, {
//            bounce : false,
//            scrollX : true,
//            scrollY : false,
//            //TODO:这里需要再看看，为什么差值为1280，而实际上需要1380才对。
//            startX : wp.clientWidth - wp.firstElementChild.clientWidth,
//          });
//        });
            });
        }
    }

</script>



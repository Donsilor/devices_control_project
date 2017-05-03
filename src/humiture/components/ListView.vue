<template>
  <div class="ct" ref="container">
    <!--<div class="scroller" :style="{width : 100 * datalist.length + 'px'}">-->
      <ul class="data-list" :style="{width : 100 * datalist.length + 'px'}">
        <li v-for="item in datalist" v-bind:class="{curr : item[3] }">
          <time class="i">{{item[0]}}</time>
          <span class="i temperature">{{item[1] | temp}}</span>
          <span class="i humidity">{{item[2] | hum}}</span>
        </li>
      </ul>
    <!--</div>-->
  </div>
</template>

<style scoped>
  /*.ct{width : 100%; overflow: hidden;white-space: nowrap; }*/
  .ct{width : 100%; overflow-x:auto;white-space: nowrap; overflow-scrolling : touch;}
  ul.data-list{list-style: none; padding:0;width:100%;}
  /*ul.data-list li.litt-title{}*/
  ul.data-list li{display: inline-block; width : 150px;}
  ul.data-list li.curr{color : #20BCDE;}
  ul.data-list li .i{display: block;height: 1.8em;}
  ul.data-list li .temperature,ul.data-list li .humidity{font-size:30px;}
</style>

<script>
  import {timeout} from '../utils';
  export default {
    name: 'list-view',
    props : {
      'datalist' : Array
    },
    filters :{
      temp  (val){
        return val ? (val + '°C') : '-'
      },
      hum (val){
        return val ? (val + '%') : '-'
      }
    },
    mounted (){
      console.log(this.$refs.container.clientWidth, this.$refs.container.clientHeight);
    }
  }
</script>



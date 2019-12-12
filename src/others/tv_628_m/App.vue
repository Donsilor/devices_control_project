<template>
  <div
    id="app"
    :class="{isIOS:isIOS}"
    style="height: 100%;">
    <!-- <router-view /> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive&&isRouterAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive&&isRouterAlive"/>

    <!-- <detail/> -->
  </div>
</template>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
ul {
  list-style: none;
}
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
// html {
//   padding-bottom: 2px;
// }
body {
  // overflow-x: hidden;
  background: #fafafa;
  height: 100%;
  font-size: 28px;
}
body,
input {
  font-family: NotoSansHans-Medium;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.page-list,
.page-search {
  padding-bottom: 120px;
}
.detail-bd {
  padding-bottom: 300px;
}
</style>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    return {
      isIOS: /iphone|ipad/i.test(navigator.userAgent),
      tv:this.$store.state.tvStatus.tvOnlineStatus,
      isRouterAlive:true
    }
  },  
  computed: {
    isNotIndex() {
      return this.$store.state.detailVisible || this.$route.path != '/'
    }
  },
  watch:{
    '$store.state.tvStatus.tvOnlineStatus':{
        handler:function(n,v){
          console.log('111111111111111111111111111111111',n,v)
            if(n===-1){
              this.$router.push('/NoNetwork')
            }else if(v===-1){
              this.$router.go(-1)
            }
        },
        immediate: true
    }
  },
 methods:{
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  }
}
</script>

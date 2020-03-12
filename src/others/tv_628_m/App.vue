<template>
  <div
    id="app"
    :class="{isIOS:isIOS}"
    style="height: 100%;">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive&&isRouterAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive&&isRouterAlive"/>
  </div>
</template>

<style lang="less">
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
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
          console.log('app.tvOnlineStatus',n,v)
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

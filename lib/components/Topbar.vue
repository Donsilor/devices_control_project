<template>
  <div
    :class="[{'topbar-nobg':transparent}, {'topbar-black': bgBlack}]"
    class="topbar">
    <div
      :style="{height:(status_bar_height + navigation_bar_height) +'px'}"
      class="topbar-block" />
    <div class="topbar-fixed">
      <div
        :style="{height:status_bar_height+'px'}"
        class="statusbar"/>
      <div
        :style="{height:navigation_bar_height+'px', 'line-height': navigation_bar_height + 'px'}"
        class="navbar" >
        <div class="left">
          <i
            class="icon-return"
            @click.prevent="goBack"/>
        </div>
        <div class="right">
          <template v-if="buttons">
            <a
              v-for="(item, index) in buttons"
              :key="index"
              :class="[item.className]"
              href="#/"
              @click.prevent="item.callback"/>
          </template>
          <template v-else>
            <a
              href="#/"
              class="icon-more"
              @click.prevent="goDetail"/>
          </template>
        </div>

        <div
          v-if="title"
          class="title">{{ title }}</div>
        <slot/>
      </div>
    </div>
  </div>
</template>


<script>

let dpr = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 1 : window.devicePixelRatio

export default {
    props: {
        back: {
            type: Function,
            default: null
        },
        buttons: {
            type: Array,
            default: function(){
                return null
            }
        },
        transparent: {
            type: Boolean,
            default: false
        },
        bgBlack: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            status_bar_height: 20,
            navigation_bar_height: 44
        }
    },
    created() {
        HdSmart.ready(() => {
            if(window.status_bar_height){
                this.status_bar_height = window.status_bar_height/dpr
            }
            if(window.navigation_bar_height){
                this.navigation_bar_height = window.navigation_bar_height/dpr
            }
        })
    },
    methods: {
        goBack() {
            if(typeof this.back === 'function'){
              this.back()
            } else if (argv_is_mock){
              window.history.go(-1)
            }else{
              HdSmart.UI.popWindow()
            }
        },
        goDetail() {
            HdSmart.UI.goDeviceDetail()
        }
    }
}
</script>


<style lang="less">
/* topbar */
@status_bar_height:20PX;
@navigation_bar_height:44PX;

.topbar-block {
    height: 64PX;
}

.topbar-fixed{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    // background: #fff;
    // border-bottom: 1px solid rgba(216, 216, 216, .7);
}

.topbar-nobg{
    .topbar-fixed{
        background: transparent;
        border-bottom: none;
    }
    .navbar{
        color: #fff;
        .left a,.right a {
            color: #fff;
        }
    }
}

.topbar-black{
    .topbar-fixed{
        background: #20282b;
        border-bottom: none;
    }
    .navbar{
        color: #fff;
        .left a,.right a {
            color: #fff;
        }
    }
}

.statusbar{
    height: @status_bar_height;
}

.navbar {
    height: @navigation_bar_height;
    position: relative;
    color: #222a37;
    .left, .right {
        position: absolute;
        top: 50%;
        right: 0;
        height: @navigation_bar_height;
        transform: translateY(-50%);
    }
    .left{
        left: 0;
        right: auto;
    }
    .title {
        text-align: center;
        font-size: 17PX;
        color: #35353D;
    }
    .left a,.right a {
        width: @navigation_bar_height;
        height: @navigation_bar_height;
        display: block;
        line-height: @navigation_bar_height;
        color: #222a37;
        text-align: center;
        font-size: 17PX;
        text-decoration: none;
        &:active {
            opacity: .8;
        }
    }
    .left a.icon-return{
      position: absolute;
      left: 40px;
      top: 55%;
      display: inline-block;
      width: 18px;
      height: 18px;
      border: solid #000;
      border-width: 2PX 2PX 0 0;
      transform: translate(0, -50%) rotate(225deg);
    }
}
</style>

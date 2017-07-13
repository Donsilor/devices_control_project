<template>
    <div class="topbar">
        <div class="left"> 
            <a class="icon icon-arrow" @click="goBack"></a>
        </div>
        <div class="right">
            <router-link to="/search" class="icon icon-search"></router-link>
        </div>
        <div class="title" v-if="title">{{title}}</div>
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .topbar{
        background: #f2f2f2;
        height: 95px;
        border-bottom: 1px solid #dbdbdb;
        position: relative;
        .left{
            position: absolute;
            top: 32px;
            left: 224px;
            z-index:9999
        }
        .right{
            position: absolute;
            top: 32px;
            right: 224px;
        }
        .title{
            text-align: center;
            line-height: 95px;
        }
        .icon{  
            width: 36px;
            height: 36px;
            display: inline-block;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .icon-arrow{
            background-image: url(../assets/icn_topbar_back_normal.png);
            &:active{   
                background-image: url(../assets/icn_topbar_back_pressed.png);
            }
        }
        .icon-search{
            background-image: url(../assets/icn_topbar_search_normal.png);
            &:active{   
                background-image: url(../assets/icn_topbar_search_pressed.png);
            }
        }
    } 
    .topbar-fixed{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 2;
    }
</style>

<script> 
    export default {
        props: ['title'],
        methods: {
            goBack(){   
                this.$router.back()
            }
        }
    }
</script>
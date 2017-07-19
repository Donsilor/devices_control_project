<template>
<transition name="slide-fade">
    <router-view></router-view>
</transition>
</template>

<style lang="less">
    *{
        padding: 0;
        margin: 0; 
    }
    a{  
        text-decoration: none;
    }
    ul{
        list-style: none;
    }
    .clearfix:after{  
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden; 
    }
    body{   
        overflow-x: hidden;
    }
    body,input{ 
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .slide-fade-enter-active {
    transition: all .3s ease;
    }
    .slide-fade-leave-active {
    /*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for <2.1.8 */ {
    transform: translateX(100%);
    }
</style> 
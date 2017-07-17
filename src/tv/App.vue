<template>
    <router-view></router-view>
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
    body,#app{
        height: 100%;
    }
    body,input{ 
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style> 
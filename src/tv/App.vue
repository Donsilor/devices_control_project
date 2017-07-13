<template>
<div id="app">
    <router-view></router-view>
</div>
</template>

<style lang="scss">
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
    body {
        height: 100%;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        height: 100%;
    }
</style> 